import type { Logger } from "@flowcatalyst/logging";
import type {
	PoolConfig,
	PoolState,
	PoolStats,
	QueueMessage,
} from "@flowcatalyst/contracts";
import type { HttpMediator } from "../mediation/http-mediator.js";
import { QueueFullError, TokenBucket } from "../utils/token-bucket.js";
import { DynamicSemaphore } from "./dynamic-semaphore.js";
import { MessageGroupHandler } from "./message-group-handler.js";

/**
 * Message callback for ack/nack
 */
export interface MessageCallback {
	ack(): Promise<void>;
	nack(visibilityTimeoutSeconds?: number): Promise<void>;
}

/**
 * Process pool implementation - matches Java ProcessPoolImpl
 * Uses per-message-group handlers for FIFO ordering within groups
 */
export class ProcessPool {
	private config: PoolConfig;
	private readonly logger: Logger;
	private readonly mediator: HttpMediator;

	private state: PoolState = "STARTING";
	private readonly messageGroups = new Map<string, MessageGroupHandler>();

	// Concurrency control (in-place adjustable, unlike p-limit)
	private readonly concurrencyLimiter: DynamicSemaphore;
	// Rate limiting — TokenBucket smooths bursts into evenly-spaced requests
	// (leaky bucket behaviour, capacity=1 by default).
	private rateLimiter: TokenBucket | null;

	// Statistics tracking
	private totalProcessed = 0;
	private totalSucceeded = 0;
	private totalFailed = 0;
	private totalTransient = 0;
	private totalRateLimited = 0;
	private totalDeferred = 0;
	private processingTimes: number[] = [];

	// Windowed stats — reset on a timer to approximate sliding windows
	private stats5min = {
		processed: 0,
		succeeded: 0,
		failed: 0,
		transient: 0,
		rateLimited: 0,
	};
	private stats30min = {
		processed: 0,
		succeeded: 0,
		failed: 0,
		transient: 0,
		rateLimited: 0,
	};
	private windowResetInterval5min: ReturnType<typeof setInterval> | null =
		null;
	private windowResetInterval30min: ReturnType<typeof setInterval> | null =
		null;

	// Batch+group failure tracking for FIFO
	private readonly failedBatchGroups = new Set<string>();
	private readonly batchGroupMessageCount = new Map<string, number>();

	// Capacity management
	private queuedMessages = 0;
	private readonly maxCapacity: number;

	constructor(config: PoolConfig, mediator: HttpMediator, logger: Logger) {
		this.config = config;
		this.mediator = mediator;
		this.logger = logger.child({
			component: "ProcessPool",
			poolCode: config.code,
		});

		// Capacity = max(concurrency * 20, 50) — matches Java QUEUE_CAPACITY_MULTIPLIER
		this.maxCapacity = Math.max(config.concurrency * 20, 50);

		// Initialize concurrency limiter
		this.concurrencyLimiter = new DynamicSemaphore(config.concurrency);

		// Initialize rate limiter
		this.rateLimiter = buildRateLimiter(
			config.rateLimitPerMinute,
			this.maxCapacity,
		);

		// Start windowed stat reset timers
		this.windowResetInterval5min = setInterval(() => {
			this.stats5min = {
				processed: 0,
				succeeded: 0,
				failed: 0,
				transient: 0,
				rateLimited: 0,
			};
		}, 5 * 60 * 1000);
		this.windowResetInterval30min = setInterval(() => {
			this.stats30min = {
				processed: 0,
				succeeded: 0,
				failed: 0,
				transient: 0,
				rateLimited: 0,
			};
		}, 30 * 60 * 1000);

		this.state = "RUNNING";
		this.logger.info(
			{ concurrency: config.concurrency, capacity: this.maxCapacity },
			"Pool started",
		);
	}

	/**
	 * Submit a message for processing
	 * Returns false if pool is at capacity or draining
	 */
	async submit(
		message: QueueMessage,
		callback: MessageCallback,
	): Promise<boolean> {
		if (this.state !== "RUNNING") {
			this.logger.warn({ state: this.state }, "Pool not accepting messages");
			return false;
		}

		// Check capacity (Backpressure)
		if (this.queuedMessages >= this.maxCapacity) {
			this.logger.warn(
				{ queued: this.queuedMessages, capacity: this.maxCapacity },
				"Pool at capacity",
			);
			return false;
		}

		this.queuedMessages++;

		// Track batch+group count
		const batchGroupKey = `${message.batchId}|${message.pointer.messageGroupId}`;
		const currentCount = this.batchGroupMessageCount.get(batchGroupKey) || 0;
		this.batchGroupMessageCount.set(batchGroupKey, currentCount + 1);

		// IMMEDIATE: skip the per-group handler. Each message runs as an
		// independent task gated only by the pool semaphore and rate limiter,
		// and does not participate in the failed-batch-group cascade. Mirrors
		// fc-router's spawn_immediate_task — without this, IMMEDIATE messages
		// sharing a messageGroupId still serialize through MessageGroupHandler.
		if (message.pointer.dispatchMode === "IMMEDIATE") {
			void this.processImmediate(message, callback, batchGroupKey);
			return true;
		}

		// Get or create message group handler
		let groupHandler = this.messageGroups.get(message.pointer.messageGroupId);
		if (!groupHandler) {
			groupHandler = new MessageGroupHandler(
				message.pointer.messageGroupId,
				this.processMessage.bind(this),
				() => {
					this.messageGroups.delete(message.pointer.messageGroupId);
					this.logger.debug(
						{ messageGroupId: message.pointer.messageGroupId },
						"Message group handler cleaned up",
					);
				},
				this.logger,
			);
			this.messageGroups.set(message.pointer.messageGroupId, groupHandler);
		}

		// Enqueue for processing
		groupHandler.enqueue(message, callback);
		return true;
	}

	/**
	 * Process a single message (called by message group handler)
	 */
	private async processMessage(
		message: QueueMessage,
		callback: MessageCallback,
	): Promise<void> {
		const batchGroupKey = `${message.batchId}|${message.pointer.messageGroupId}`;

		// Check if batch+group already failed (FIFO preservation)
		if (this.failedBatchGroups.has(batchGroupKey)) {
			this.logger.debug(
				{ messageId: message.messageId, batchGroupKey },
				"Skipping message due to batch+group failure",
			);
			await callback.nack(10); // 10s fast-fail visibility, matching Java
			this.decrementBatchGroupCount(batchGroupKey);
			this.queuedMessages--;
			return;
		}

		// Step 1: Rate Limiting (Wait logic)
		// TokenBucket.acquire() resolves when a token is available, smoothing
		// bursts into evenly-spaced requests (leaky bucket).
		if (this.rateLimiter) {
			try {
				await this.rateLimiter.acquire();
			} catch (err) {
				// QueueFullError when maxQueueSize exceeded — count as rate-limited
				if (err instanceof QueueFullError) {
					this.totalRateLimited++;
					this.stats5min.rateLimited++;
					this.stats30min.rateLimited++;
					await callback.nack(10);
					this.decrementBatchGroupCount(batchGroupKey);
					this.queuedMessages--;
					return;
				}
				throw err;
			}
		}

		// Step 2: Concurrency Control (Work logic)
		await this.concurrencyLimiter.run(async () => {
			try {
				const startTime = Date.now();
				const result = await this.mediator.process(message);
				const durationMs = Date.now() - startTime;

				this.recordProcessingTime(durationMs);
				this.totalProcessed++;
				this.stats5min.processed++;
				this.stats30min.processed++;

				switch (result.outcome) {
					case "SUCCESS":
						this.totalSucceeded++;
						this.stats5min.succeeded++;
						this.stats30min.succeeded++;
						await callback.ack();
						this.decrementBatchGroupCount(batchGroupKey);
						break;

					case "ERROR_CONFIG":
						// 4xx errors - ack to prevent infinite retry
						this.totalFailed++;
						this.stats5min.failed++;
						this.stats30min.failed++;
						await callback.ack();
						this.decrementBatchGroupCount(batchGroupKey);
						break;

					case "DEFERRED":
						// Message deferred (ack=false) - nack with visibility, mark batch+group failed (FIFO)
						this.totalDeferred++;
						this.failedBatchGroups.add(batchGroupKey);
						await callback.nack(result.delaySeconds || 30);
						this.decrementBatchGroupCount(batchGroupKey);
						break;

					case "ERROR_PROCESS":
					case "BATCH_FAILED":
						// 5xx or timeout — transient, NOT counted as failure (matches Java)
						this.totalTransient++;
						this.stats5min.transient++;
						this.stats30min.transient++;
						this.failedBatchGroups.add(batchGroupKey);
						await callback.nack(result.delaySeconds ?? 30);
						this.decrementBatchGroupCount(batchGroupKey);
						break;

					case "RATE_LIMITED":
						// Destination throttled us (HTTP 429). NACK with the
						// Retry-After delay so the queue redelivers later.
						// Deliberately NOT counted as a delivery attempt or
						// failure, and we do NOT mark the batch+group as
						// failed: a 429 means "try again later", not "this
						// group is broken". Subsequent messages in the group
						// will retry naturally and either succeed or hit the
						// same 429 (and wait again).
						this.totalRateLimited++;
						this.stats5min.rateLimited++;
						this.stats30min.rateLimited++;
						await callback.nack(result.delaySeconds ?? 30);
						this.decrementBatchGroupCount(batchGroupKey);
						break;

					case "ERROR_CONNECTION":
					default:
						// Connection/network errors — counted as failure (matches Java)
						this.totalFailed++;
						this.stats5min.failed++;
						this.stats30min.failed++;
						this.failedBatchGroups.add(batchGroupKey);
						await callback.nack(result.delaySeconds ?? 30);
						this.decrementBatchGroupCount(batchGroupKey);
						break;
				}
			} catch (error) {
				this.logger.error(
					{ err: error, messageId: message.messageId },
					"Processing error",
				);
				this.totalFailed++;
				this.stats5min.failed++;
				this.stats30min.failed++;
				this.failedBatchGroups.add(batchGroupKey);
				await callback.nack(30);
				this.decrementBatchGroupCount(batchGroupKey);
			} finally {
				this.queuedMessages--;
			}
		});
	}

	/**
	 * Process an IMMEDIATE-mode message without per-group serialization.
	 * Does not read or write failedBatchGroups: a 5xx on one IMMEDIATE message
	 * must not cascade-NACK siblings sharing the same batch+group.
	 */
	private async processImmediate(
		message: QueueMessage,
		callback: MessageCallback,
		batchGroupKey: string,
	): Promise<void> {
		// Step 1: Rate limiting
		if (this.rateLimiter) {
			try {
				await this.rateLimiter.acquire();
			} catch (err) {
				if (err instanceof QueueFullError) {
					this.totalRateLimited++;
					this.stats5min.rateLimited++;
					this.stats30min.rateLimited++;
					await callback.nack(10);
					this.decrementBatchGroupCount(batchGroupKey);
					this.queuedMessages--;
					return;
				}
				throw err;
			}
		}

		// Step 2: Concurrency + mediation
		await this.concurrencyLimiter.run(async () => {
			try {
				const startTime = Date.now();
				const result = await this.mediator.process(message);
				const durationMs = Date.now() - startTime;

				this.recordProcessingTime(durationMs);
				this.totalProcessed++;
				this.stats5min.processed++;
				this.stats30min.processed++;

				switch (result.outcome) {
					case "SUCCESS":
						this.totalSucceeded++;
						this.stats5min.succeeded++;
						this.stats30min.succeeded++;
						await callback.ack();
						break;

					case "ERROR_CONFIG":
						this.totalFailed++;
						this.stats5min.failed++;
						this.stats30min.failed++;
						await callback.ack();
						break;

					case "DEFERRED":
						this.totalDeferred++;
						await callback.nack(result.delaySeconds || 30);
						break;

					case "ERROR_PROCESS":
					case "BATCH_FAILED":
						this.totalTransient++;
						this.stats5min.transient++;
						this.stats30min.transient++;
						await callback.nack(result.delaySeconds ?? 30);
						break;

					case "RATE_LIMITED":
						this.totalRateLimited++;
						this.stats5min.rateLimited++;
						this.stats30min.rateLimited++;
						await callback.nack(result.delaySeconds ?? 30);
						break;

					case "ERROR_CONNECTION":
					default:
						this.totalFailed++;
						this.stats5min.failed++;
						this.stats30min.failed++;
						await callback.nack(result.delaySeconds ?? 30);
						break;
				}
			} catch (error) {
				this.logger.error(
					{ err: error, messageId: message.messageId },
					"IMMEDIATE processing error",
				);
				this.totalFailed++;
				this.stats5min.failed++;
				this.stats30min.failed++;
				await callback.nack(30);
			} finally {
				this.decrementBatchGroupCount(batchGroupKey);
				this.queuedMessages--;
			}
		});
	}

	/**
	 * Decrement batch group count and cleanup if zero
	 */
	private decrementBatchGroupCount(key: string): void {
		const current = this.batchGroupMessageCount.get(key);
		if (current !== undefined) {
			const next = current - 1;
			if (next <= 0) {
				this.batchGroupMessageCount.delete(key);
				this.failedBatchGroups.delete(key);
			} else {
				this.batchGroupMessageCount.set(key, next);
			}
		}
	}

	/**
	 * Get pool statistics
	 */
	getStats(): PoolStats {
		const activeWorkers = this.concurrencyLimiter.activeCount;

		// Success rate excludes transient errors (matches Java)
		const completed = this.totalSucceeded + this.totalFailed;
		const successRate = completed > 0 ? this.totalSucceeded / completed : 1.0;

		const completed5min = this.stats5min.succeeded + this.stats5min.failed;
		const successRate5min =
			completed5min > 0 ? this.stats5min.succeeded / completed5min : 1.0;

		const completed30min =
			this.stats30min.succeeded + this.stats30min.failed;
		const successRate30min =
			completed30min > 0
				? this.stats30min.succeeded / completed30min
				: 1.0;

		return {
			poolCode: this.config.code,
			totalProcessed: this.totalProcessed,
			totalSucceeded: this.totalSucceeded,
			totalFailed: this.totalFailed,
			totalTransient: this.totalTransient,
			totalRateLimited: this.totalRateLimited,
			successRate,
			activeWorkers,
			availablePermits: this.config.concurrency - activeWorkers,
			maxConcurrency: this.config.concurrency,
			queueSize: this.queuedMessages,
			maxQueueCapacity: this.maxCapacity,
			averageProcessingTimeMs: this.getAverageProcessingTime(),
			totalProcessed5min: this.stats5min.processed,
			totalSucceeded5min: this.stats5min.succeeded,
			totalFailed5min: this.stats5min.failed,
			totalTransient5min: this.stats5min.transient,
			successRate5min,
			totalProcessed30min: this.stats30min.processed,
			totalSucceeded30min: this.stats30min.succeeded,
			totalFailed30min: this.stats30min.failed,
			totalTransient30min: this.stats30min.transient,
			successRate30min,
			totalRateLimited5min: this.stats5min.rateLimited,
			totalRateLimited30min: this.stats30min.rateLimited,
		};
	}

	/**
	 * Update pool configuration in-place
	 */
	updateConfig(newConfig: Partial<PoolConfig>): void {
		if (newConfig.rateLimitPerMinute !== undefined) {
			const newRate = newConfig.rateLimitPerMinute;
			const enabled = newRate != null && newRate > 0;
			if (!enabled) {
				if (this.rateLimiter) {
					this.rateLimiter.dispose();
					this.rateLimiter = null;
				}
				this.logger.info("Rate limit disabled");
			} else if (this.rateLimiter) {
				// In-place update preserves queued waiters' FIFO position.
				this.rateLimiter.setRate(newRate);
				this.logger.info(
					{ rateLimitPerMinute: newRate },
					"Rate limit updated in-place",
				);
			} else {
				this.rateLimiter = buildRateLimiter(newRate, this.maxCapacity);
				this.logger.info(
					{ rateLimitPerMinute: newRate },
					"Rate limit enabled",
				);
			}
		}

		if (newConfig.concurrency !== undefined) {
			this.concurrencyLimiter.setLimit(newConfig.concurrency);
			this.logger.info(
				{ concurrency: newConfig.concurrency },
				"Concurrency updated in-place",
			);
		}

		// Keep stored config in sync with applied changes
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * Get the current pool configuration
	 */
	getConfig(): Readonly<PoolConfig> {
		return this.config;
	}

	/**
	 * Start draining - stop accepting new messages
	 */
	drain(): void {
		this.state = "DRAINING";
		this.logger.info("Pool draining started");
	}

	/**
	 * Check if pool is fully drained
	 */
	isDrained(): boolean {
		return (
			this.state === "DRAINING" &&
			this.queuedMessages === 0 &&
			this.concurrencyLimiter.activeCount === 0
		);
	}

	/**
	 * Shutdown the pool
	 */
	async shutdown(): Promise<void> {
		this.state = "STOPPED";
		if (this.windowResetInterval5min) {
			clearInterval(this.windowResetInterval5min);
			this.windowResetInterval5min = null;
		}
		if (this.windowResetInterval30min) {
			clearInterval(this.windowResetInterval30min);
			this.windowResetInterval30min = null;
		}
		if (this.rateLimiter) {
			this.rateLimiter.dispose();
			this.rateLimiter = null;
		}
		this.messageGroups.clear();
		this.failedBatchGroups.clear();
		this.batchGroupMessageCount.clear();
		this.logger.info("Pool shutdown complete");
	}

	/**
	 * Get current state
	 */
	getState(): PoolState {
		return this.state;
	}

	/**
	 * Get pool code
	 */
	getCode(): string {
		return this.config.code;
	}

	private recordProcessingTime(durationMs: number): void {
		this.processingTimes.push(durationMs);
		// Keep last 1000 samples
		if (this.processingTimes.length > 1000) {
			this.processingTimes.shift();
		}
	}

	private getAverageProcessingTime(): number {
		if (this.processingTimes.length === 0) return 0;
		const sum = this.processingTimes.reduce((a, b) => a + b, 0);
		return sum / this.processingTimes.length;
	}
}

/**
 * Build a TokenBucket that smooths bursts into evenly-spaced requests
 * (leaky bucket, capacity=1). Returns null if rate limiting is disabled.
 */
function buildRateLimiter(
	ratePerMinute: number | null | undefined,
	maxQueueSize: number,
): TokenBucket | null {
	if (!ratePerMinute || ratePerMinute <= 0) return null;
	return new TokenBucket({ ratePerMinute, maxQueueSize });
}
