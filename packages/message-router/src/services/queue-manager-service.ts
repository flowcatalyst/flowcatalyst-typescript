import type { Logger } from "@flowcatalyst/logging";
import type {
	ConsumerHealthResponse,
	InFlightMessage,
	LocalConfigResponse,
	MessageBatch,
	PoolConfig,
	PoolStats,
	QueueStats,
} from "@flowcatalyst/contracts";
import {
	type CircuitBreakerManager,
	HttpMediator,
	type HttpMediatorConfig,
	ProcessPool,
	type QueueConsumer,
	type MessageCallbackFns,
} from "@flowcatalyst/queue-core";
import type { WarningService } from "./warning-service.js";
import type { QueueValidationService } from "./queue-validation-service.js";
import {
	PlatformConfigClient,
	ConfigSyncService,
	type MessageRouterConfig,
} from "../clients/platform-config-client.js";
import { MultiConfigFetcher } from "../clients/multi-config-client.js";
import { sleep } from "@flowcatalyst/queue-core";
import { EmbeddedQueue } from "../embedded/index.js";
import type { TrafficManager } from "../traffic/index.js";
import { env } from "../env.js";
import { InFlightTracker } from "./queue-manager/in-flight-tracker.js";
import { BackgroundTaskScheduler } from "./queue-manager/background-task-scheduler.js";
import {
	initializeActiveMqMode,
	initializeEmbeddedMode,
	initializeNatsMode,
	type BrokerInitContext,
} from "./queue-manager/broker-initializers.js";
import { ConfigApplicator } from "./queue-manager/config-applicator.js";
import { BatchDispatcher } from "./queue-manager/batch-dispatcher.js";
import {
	monitorAndRestartUnhealthyConsumers,
	pauseAllConsumers,
	resumeAllConsumers,
	type ConsumerLifecycleDeps,
} from "./queue-manager/consumer-lifecycle.js";
import {
	getConsumerHealth as collectConsumerHealth,
	getQueueStats as collectQueueStats,
	refreshQueueMetrics as refreshAllConsumerMetrics,
	type StatsReportingDeps,
} from "./queue-manager/stats-reporting.js";

/**
 * Queue manager service - orchestrates consumers, pools, and mediation
 */
export class QueueManagerService {
	private readonly circuitBreakers: CircuitBreakerManager;
	private readonly warnings: WarningService;
	private readonly traffic: TrafficManager;
	private readonly queueValidation: QueueValidationService;
	private readonly logger: Logger;

	private running = false;

	// HTTP Mediation
	private readonly httpMediator: HttpMediator;

	// Configuration
	private currentConfig: MessageRouterConfig | null = null;
	private configSyncService: ConfigSyncService | null = null;

	// Consumers (single unified map - matches Java QueueManager pattern)
	private readonly consumers = new Map<string, QueueConsumer>();

	// Embedded queue (for EMBEDDED mode)
	private embeddedQueue: EmbeddedQueue | null = null;

	// Process pools
	private readonly processPools = new Map<string, ProcessPool>();
	private readonly drainingPools = new Map<string, ProcessPool>();
	private readonly drainingConsumers = new Map<string, QueueConsumer>();

	// Pool limits (matching Java)
	private readonly maxPools = env.MAX_POOLS;
	private readonly poolWarningThreshold = Math.floor(env.MAX_POOLS * 0.5); // 50% threshold

	// Config applicator (owns the syncChain promise internally)
	private readonly configApplicator: ConfigApplicator;

	// Background timers (cleanup, health, leak, window resets)
	private readonly backgroundTasks: BackgroundTaskScheduler;

	// Queue and pool statistics
	private readonly queueStats = new Map<string, QueueStats>();

	// In-flight message tracking (encapsulated)
	private readonly inFlight: InFlightTracker;

	// Batch dispatcher (3-phase routing: dedup -> capacity -> per-group)
	private readonly batchDispatcher: BatchDispatcher;

	constructor(
		circuitBreakers: CircuitBreakerManager,
		warnings: WarningService,
		traffic: TrafficManager,
		queueValidation: QueueValidationService,
		logger: Logger,
	) {
		this.circuitBreakers = circuitBreakers;
		this.warnings = warnings;
		this.traffic = traffic;
		this.queueValidation = queueValidation;
		this.logger = logger.child({ component: "QueueManager" });

		// Create HTTP mediator with configuration from env
		const mediatorConfig: HttpMediatorConfig = {
			callbackUrl: "", // Will be overridden per-message
			useHttp2: env.MEDIATION_HTTP2,
			connectTimeoutMs: env.MEDIATION_CONNECT_TIMEOUT_MS,
			headersTimeoutMs: env.MEDIATION_HEADERS_TIMEOUT_MS,
			bodyTimeoutMs: env.MEDIATION_REQUEST_TIMEOUT_MS,
			retries: env.MEDIATION_RETRIES,
			retryDelayMs: env.MEDIATION_RETRY_DELAY_MS,
			h2MaxConcurrentStreams: env.MEDIATION_H2_MAX_CONCURRENT_STREAMS,
			connectionsPerOrigin: env.MEDIATION_CONNECTIONS_PER_ORIGIN,
		};

		this.httpMediator = new HttpMediator(
			mediatorConfig,
			circuitBreakers,
			logger,
		);

		this.inFlight = new InFlightTracker({
			warnings: this.warnings,
			logger: this.logger,
			totalPoolCapacity: () => {
				let total = 0;
				for (const pool of this.processPools.values()) {
					total += pool.getStats().maxQueueCapacity;
				}
				return total;
			},
			isRunning: () => this.running,
		});

		this.backgroundTasks = new BackgroundTaskScheduler(this.logger);

		this.batchDispatcher = new BatchDispatcher({
			logger: this.logger,
			warnings: this.warnings,
			inFlight: this.inFlight,
			queueStats: this.queueStats,
			processPools: this.processPools,
			httpMediator: this.httpMediator,
		});

		this.configApplicator = new ConfigApplicator({
			logger: this.logger,
			warnings: this.warnings,
			queueValidation: this.queueValidation,
			httpMediator: this.httpMediator,
			processPools: this.processPools,
			drainingPools: this.drainingPools,
			consumers: this.consumers,
			drainingConsumers: this.drainingConsumers,
			queueStats: this.queueStats,
			maxPools: this.maxPools,
			poolWarningThreshold: this.poolWarningThreshold,
			setCurrentConfig: (config) => {
				this.currentConfig = config;
			},
			brokerInitContext: () => this.brokerInitContext(),
		});
	}

	/**
	 * Build the slice of state the broker initializers need. Captures
	 * `this` so the helper module never touches private fields directly.
	 */
	private brokerInitContext(): BrokerInitContext {
		return {
			logger: this.logger,
			httpMediator: this.httpMediator,
			processPools: this.processPools,
			consumers: this.consumers,
			queueStats: this.queueStats,
			setEmbeddedQueue: (queue) => {
				this.embeddedQueue = queue;
			},
			handleBatch: (batch, callbacks) => this.handleBatch(batch, callbacks),
		};
	}

	/**
	 * Start the queue manager
	 */
	async start(): Promise<void> {
		this.logger.info({ queueType: env.QUEUE_TYPE }, "Starting queue manager");

		// Register mode change listener for standby support
		this.traffic.addModeChangeListener((newMode, previousMode) => {
			this.handleModeChange(newMode, previousMode);
		});

		// Start traffic manager (handles ALB registration)
		const trafficResult = await this.traffic.start();
		trafficResult.match(
			() => this.logger.info("Traffic manager started"),
			(error) => {
				this.logger.error({ err: error }, "Failed to start traffic manager");
				this.warnings.add(
					"CONFIGURATION",
					"WARNING",
					`Traffic manager failed to start: ${error.type}`,
					"QueueManager",
				);
			},
		);

		if (env.QUEUE_TYPE === "EMBEDDED") {
			// Use embedded mode with SQLite-backed queue
			await initializeEmbeddedMode(this.brokerInitContext());
			this.startBackgroundTasks();
			this.running = true;
			this.pauseConsumersIfStandby();
			this.logger.info("Queue manager started in embedded mode");
			return;
		}

		if (env.QUEUE_TYPE === "ACTIVEMQ") {
			// Use ActiveMQ mode
			await initializeActiveMqMode(this.brokerInitContext());
			this.startBackgroundTasks();
			this.running = true;
			this.pauseConsumersIfStandby();
			this.logger.info("Queue manager started in ActiveMQ mode");
			return;
		}

		if (env.QUEUE_TYPE === "NATS") {
			// Use NATS JetStream mode
			await initializeNatsMode(this.brokerInitContext());
			this.startBackgroundTasks();
			this.running = true;
			this.pauseConsumersIfStandby();
			this.logger.info("Queue manager started in NATS mode");
			return;
		}

		// SQS mode - fetch config from platform
		if (env.ROUTER_CONFIG_URL) {
			const urls = env.ROUTER_CONFIG_URL;

			this.logger.info(
				{ sources: urls },
				`Fetching config from ${urls.length} source(s)`,
			);

			const clients = urls.map((url) => ({
				url,
				client: new PlatformConfigClient(
					{ configUrl: url, apiKey: env.PLATFORM_API_KEY },
					this.logger,
				),
			}));

			const configFetcher =
				clients.length === 1
					? clients[0]!.client
					: new MultiConfigFetcher(clients, this.logger);

			this.configSyncService = new ConfigSyncService(
				configFetcher,
				env.SYNC_INTERVAL_MS,
				async (config) => this.applyConfiguration(config),
				this.logger,
			);

			const success = await this.configSyncService.start();
			if (!success) {
				this.warnings.add(
					"CONFIG_SYNC_FAILED",
					"CRITICAL",
					"Failed to fetch initial configuration from platform — exiting",
					"QueueManager",
				);
				this.logger.fatal(
					"Initial configuration sync failed after all retries — exiting",
				);
				throw new Error(
					"Initial configuration sync failed — cannot start without platform config",
				);
			}
		} else {
			// No platform URL - use embedded mode
			this.logger.warn("No ROUTER_CONFIG_URL configured, using embedded mode");
			await initializeEmbeddedMode(this.brokerInitContext());
		}

		// Start scheduled tasks (matches Java scheduled tasks)
		this.startBackgroundTasks();

		this.running = true;
		this.pauseConsumersIfStandby();
		this.logger.info("Queue manager started");
	}

	/**
	 * Start the five background timers. The scheduler owns the handles;
	 * we supply the per-tick logic via callbacks. Note: window-reset
	 * timers run on **every** start, including modes other than SQS,
	 * matching prior behaviour where `startQueueWindowResets()` was
	 * called before mode-specific init.
	 */
	private startBackgroundTasks(): void {
		this.backgroundTasks.start({
			onCleanupTick: () => this.cleanupDrainingResources(),
			onHealthCheck: () => {
				if (!this.running) return;
				void monitorAndRestartUnhealthyConsumers(this.consumerLifecycleDeps());
			},
			onLeakCheck: () => this.inFlight.checkForLeaks(),
			onWindowReset5min: () => {
				for (const stat of this.queueStats.values()) {
					stat.totalMessages5min = 0;
					stat.totalConsumed5min = 0;
					stat.totalFailed5min = 0;
					stat.successRate5min = 1.0;
				}
			},
			onWindowReset30min: () => {
				for (const stat of this.queueStats.values()) {
					stat.totalMessages30min = 0;
					stat.totalConsumed30min = 0;
					stat.totalFailed30min = 0;
					stat.successRate30min = 1.0;
				}
			},
		});
	}

	/**
	 * Cleanup drained pools and consumers
	 * Called periodically to remove fully drained resources
	 */
	private cleanupDrainingResources(): void {
		if (!this.running) return;

		// Cleanup fully drained pools
		for (const [code, pool] of this.drainingPools) {
			if (pool.isDrained()) {
				this.logger.info(
					{ poolCode: code },
					"Draining pool fully drained, shutting down",
				);
				pool.shutdown().catch((err) => {
					this.logger.error(
						{ err, poolCode: code },
						"Error shutting down drained pool",
					);
				});
				this.drainingPools.delete(code);
			} else {
				const stats = pool.getStats();
				this.logger.debug(
					{
						poolCode: code,
						queueSize: stats.queueSize,
						activeWorkers: stats.activeWorkers,
					},
					"Pool still draining",
				);
			}
		}

		// Cleanup fully stopped consumers
		for (const [queueUri, consumer] of this.drainingConsumers) {
			if (consumer.isFullyStopped()) {
				this.logger.info({ queueUri }, "Draining consumer fully stopped");
				this.drainingConsumers.delete(queueUri);
			} else {
				this.logger.debug({ queueUri }, "Consumer still draining");
			}
		}

		// Log cleanup state periodically
		if (this.drainingPools.size > 0 || this.drainingConsumers.size > 0) {
			this.logger.debug(
				{
					drainingPools: this.drainingPools.size,
					drainingConsumers: this.drainingConsumers.size,
				},
				"Resources still draining",
			);
		}
	}

	/**
	 * Build the slice of state consumer-lifecycle helpers need. Same
	 * approach as {@link brokerInitContext}.
	 */
	private consumerLifecycleDeps(): ConsumerLifecycleDeps {
		return {
			logger: this.logger,
			warnings: this.warnings,
			consumers: this.consumers,
			drainingConsumers: this.drainingConsumers,
			handleBatch: (batch, callbacks) => this.handleBatch(batch, callbacks),
		};
	}

	/**
	 * Stop the queue manager.
	 * Matches Java QueueManager.onShutdown() sequence:
	 *   1. Pause scheduled tasks
	 *   2. Stop consumers (25s timeout)
	 *   3. Drain pools (30s timeout)
	 *   4. NACK remaining in-flight messages
	 */
	async stop(): Promise<void> {
		this.logger.info("Stopping queue manager");
		this.running = false;

		// Step 1: Stop all scheduled tasks
		this.backgroundTasks.stop();

		// Stop traffic manager (handles ALB deregistration)
		const trafficResult = await this.traffic.stop();
		trafficResult.match(
			() => this.logger.info("Traffic manager stopped"),
			(error) =>
				this.logger.error({ err: error }, "Error stopping traffic manager"),
		);

		// Stop config sync
		if (this.configSyncService) {
			await this.configSyncService.stop();
		}

		// Stop embedded queue
		if (this.embeddedQueue) {
			await this.embeddedQueue.close();
			this.embeddedQueue = null;
		}

		// Step 2: Stop all consumers with 25s timeout (matches Java)
		const consumerStopPromises = [...this.consumers.entries()].map(
			([queueId, consumer]) => {
				this.drainingConsumers.set(queueId, consumer);
				return consumer.stop().catch((err) => {
					this.logger.error({ err, queueId }, "Error stopping consumer");
				});
			},
		);
		this.consumers.clear();

		await Promise.race([
			Promise.allSettled(consumerStopPromises),
			sleep(25_000),
		]);

		if (this.drainingConsumers.size > 0) {
			for (const [queueId, consumer] of this.drainingConsumers) {
				if (!consumer.isFullyStopped()) {
					this.logger.warn({ queueId }, "Consumer did not stop within timeout");
				}
			}
		}
		this.drainingConsumers.clear();

		// Step 3: Drain all pools with 30s timeout (matches Java)
		for (const pool of this.processPools.values()) {
			pool.drain();
		}
		const poolDrainCheck = async () => {
			while (![...this.processPools.values()].every((p) => p.isDrained())) {
				await sleep(500);
			}
		};
		await Promise.race([poolDrainCheck(), sleep(30_000)]);

		// Force shutdown remaining pools (parallel — independent)
		await Promise.all(
			[...this.processPools.values()].map((pool) => pool.shutdown()),
		);
		this.processPools.clear();

		// Step 4: NACK all remaining in-flight messages (parallel — independent API calls)
		const nackPromises: Promise<void>[] = [];
		this.inFlight.forEachCallback((_key, callback) => {
			nackPromises.push(callback.nack());
		});
		const nackResults = await Promise.allSettled(nackPromises);
		let nackErrors = 0;
		for (const result of nackResults) {
			if (result.status === "rejected") {
				nackErrors++;
				this.logger.error(
					{ err: result.reason },
					"Error NACKing message during shutdown",
				);
			}
		}
		if (nackErrors > 0) {
			this.warnings.add(
				"SHUTDOWN_CLEANUP_ERRORS",
				"WARNING",
				`${nackErrors} error(s) NACKing messages during shutdown`,
				"QueueManager",
			);
		}

		this.inFlight.clear();

		// Close HTTP mediator
		await this.httpMediator.close();

		this.logger.info("Queue manager stopped");
	}

	/**
	 * Check if running
	 */
	isRunning(): boolean {
		return this.running;
	}

	/**
	 * Handle traffic mode changes (PRIMARY/STANDBY transitions)
	 * Pauses consumers on STANDBY, resumes on PRIMARY
	 */
	private handleModeChange(
		newMode: "PRIMARY" | "STANDBY",
		previousMode: "PRIMARY" | "STANDBY",
	): void {
		this.logger.info({ newMode, previousMode }, "Traffic mode changed");
		if (newMode === "STANDBY") {
			pauseAllConsumers(this.consumerLifecycleDeps());
		} else if (newMode === "PRIMARY" && previousMode === "STANDBY") {
			resumeAllConsumers(this.consumerLifecycleDeps());
		}
	}

	/**
	 * If traffic manager is already in STANDBY mode (set by StandbyService
	 * before consumers were created), immediately pause all consumers.
	 */
	private pauseConsumersIfStandby(): void {
		if (this.traffic.isStandby()) {
			this.logger.info("StandbyService already set STANDBY mode - pausing consumers");
			pauseAllConsumers(this.consumerLifecycleDeps());
		}
	}

	/**
	 * Apply new configuration. Serialized inside the applicator so
	 * concurrent platform pushes can't interleave.
	 */
	private async applyConfiguration(config: MessageRouterConfig): Promise<void> {
		await this.configApplicator.apply(config);
	}

	/**
	 * Unified batch handler for all consumer types — delegates to the
	 * batch dispatcher. Kept as a private method so the broker
	 * initializers can pass it as a callback by reference.
	 */
	private async handleBatch(
		batch: MessageBatch,
		callbacks: Map<string, MessageCallbackFns>,
	): Promise<void> {
		return this.batchDispatcher.dispatch(batch, callbacks);
	}

	/**
	 * Get local configuration - matches Java LocalConfigResponse
	 */
	getConfig(): LocalConfigResponse {
		if (this.currentConfig) {
			return {
				queues: this.currentConfig.queues,
				connections: this.currentConfig.connections,
				processingPools: this.currentConfig.processingPools,
			};
		}

		// Return mock config for embedded mode
		return {
			queues: Array.from(this.queueStats.values()).map((q) => ({
				queueUri: q.name,
				queueName: q.name,
				connections: env.DEFAULT_CONNECTIONS,
			})),
			connections: env.DEFAULT_CONNECTIONS,
			processingPools: Array.from(this.processPools.values()).map((p) => ({
				code: p.getCode(),
				concurrency: p.getStats().maxConcurrency,
				rateLimitPerMinute: null,
			})),
		};
	}

	/**
	 * Reload configuration from a request payload. Returns the before/after
	 * pool counts so the admin caller can confirm what changed. Mirrors
	 * Rust `POST /config/reload`.
	 */
	async reloadConfig(config: MessageRouterConfig): Promise<{
		poolsBefore: number;
		poolsAfter: number;
		poolsCreated: number;
		poolsRemoved: number;
	}> {
		const poolsBefore = this.processPools.size;
		await this.applyConfiguration(config);
		const poolsAfter = this.processPools.size;
		return {
			poolsBefore,
			poolsAfter,
			poolsCreated: Math.max(0, poolsAfter - poolsBefore),
			poolsRemoved: Math.max(0, poolsBefore - poolsAfter),
		};
	}

	/**
	 * Update a single pool's runtime configuration (concurrency,
	 * rate limit). If the pool isn't in the current config, it's added
	 * with sane defaults. Mirrors Rust `PUT /monitoring/pools/{pool_code}`.
	 */
	async updatePoolConfig(
		poolCode: string,
		patch: {
			concurrency?: number | undefined;
			rateLimitPerMinute?: number | null | undefined;
		},
	): Promise<{ concurrency: number; rateLimitPerMinute: number | null }> {
		const currentPools = this.currentConfig?.processingPools ?? [];
		const existing = currentPools.find((p) => p.code === poolCode);
		const concurrency = patch.concurrency ?? existing?.concurrency ?? 10;
		const rateLimitPerMinute =
			patch.rateLimitPerMinute !== undefined
				? patch.rateLimitPerMinute
				: (existing?.rateLimitPerMinute ?? null);

		const nextPools: PoolConfig[] = existing
			? currentPools.map((p) =>
					p.code === poolCode ? { code: poolCode, concurrency, rateLimitPerMinute } : p,
				)
			: [...currentPools, { code: poolCode, concurrency, rateLimitPerMinute }];

		const nextConfig: MessageRouterConfig = this.currentConfig
			? { ...this.currentConfig, processingPools: nextPools }
			: {
					queues: [],
					connections: env.DEFAULT_CONNECTIONS,
					processingPools: nextPools,
				};

		await this.applyConfiguration(nextConfig);
		return { concurrency, rateLimitPerMinute };
	}

	/**
	 * Force all consumers to refresh their metrics from the broker.
	 * Called when the dashboard user clicks Refresh.
	 */
	async refreshQueueMetrics(): Promise<void> {
		await refreshAllConsumerMetrics(this.statsReportingDeps());
	}

	/** Queue statistics — see {@link collectQueueStats}. */
	getQueueStats(): Record<string, QueueStats> {
		return collectQueueStats(this.statsReportingDeps());
	}

	private statsReportingDeps(): StatsReportingDeps {
		return {
			consumers: this.consumers,
			queueStats: this.queueStats,
			embeddedQueue: () => this.embeddedQueue,
		};
	}

	/**
	 * Get pool statistics - matches Java response format
	 */
	getPoolStats(): Record<string, PoolStats> {
		const result: Record<string, PoolStats> = {};
		for (const [code, pool] of this.processPools) {
			result[code] = pool.getStats();
		}
		return result;
	}

	/**
	 * Get in-flight messages
	 */
	getInFlightMessages(
		limit: number,
		messageId?: string,
		poolCode?: string,
	): InFlightMessage[] {
		return this.inFlight.getMessages(limit, {
			...(messageId ? { messageId } : {}),
			...(poolCode ? { poolCode } : {}),
		});
	}

	/** Consumer health — see {@link collectConsumerHealth}. */
	getConsumerHealth(): ConsumerHealthResponse {
		return collectConsumerHealth(this.statsReportingDeps());
	}

	/**
	 * Get circuit breaker statistics
	 */
	getCircuitBreakerStats() {
		return this.circuitBreakers.getAllStats();
	}

	/**
	 * Get HTTP mediator statistics
	 * Note: HttpMediator doesn't track stats currently
	 */
	getMediatorStats() {
		return {};
	}

	/**
	 * Get traffic management statistics
	 */
	getTrafficStats() {
		return this.traffic.getStats();
	}

	/**
	 * Get traffic statistics (standby mode status)
	 */
	getDetailedTrafficStats() {
		return this.traffic.getStats();
	}

	/**
	 * Check if a message is in the pipeline
	 */
	isMessageInPipeline(pipelineKey: string): boolean {
		return this.inFlight.isPipelineKeyInFlight(pipelineKey);
	}

	/**
	 * Cheap presence check by **application** message ID. O(1) — two
	 * map lookups, no iteration. Designed for an external recovery system
	 * that wants to know whether the router is already actively processing
	 * a message before re-enqueueing it.
	 */
	isInFlightByAppId(appMessageId: string): boolean {
		return this.inFlight.isInFlightByAppId(appMessageId);
	}

	/**
	 * Batch presence check by application message IDs. Returns a
	 * `Record<messageId, boolean>` where `true` means the router is
	 * currently holding the message (caller should NOT resend) and
	 * `false` means it does not (safe to resend). Each lookup is O(1).
	 */
	areInFlightByAppIds(appMessageIds: string[]): Record<string, boolean> {
		return this.inFlight.areInFlightByAppIds(appMessageIds);
	}

	/**
	 * Publish a message to the embedded queue (only works in EMBEDDED mode)
	 */
	publishToEmbeddedQueue(message: {
		messageId: string;
		messageGroupId: string;
		messageDeduplicationId?: string;
		payload: unknown;
	}): { success: boolean; error?: string; deduplicated?: boolean } {
		if (!this.embeddedQueue) {
			return { success: false, error: "Embedded queue not available" };
		}

		return this.embeddedQueue.publish(message);
	}

	/**
	 * Check if embedded queue is available
	 */
	hasEmbeddedQueue(): boolean {
		return this.embeddedQueue !== null;
	}

}

