import {
	SQSClient,
	ReceiveMessageCommand,
	DeleteMessageCommand,
	ChangeMessageVisibilityCommand,
	GetQueueAttributesCommand,
	type Message,
} from "@aws-sdk/client-sqs";
import type { Logger } from "@flowcatalyst/logging";
import type {
	QueueConsumer,
	ConsumerHealth,
	QueueMetrics,
	MessageCallbackFns,
	StandardBatchHandler,
} from "@flowcatalyst/queue-core";
import type {
	MessageBatch,
	MessagePointer,
	QueueMessage,
} from "@flowcatalyst/contracts";
import { randomUUID } from "node:crypto";
import { env } from "../env.js";

/**
 * SQS Consumer configuration
 */
export interface SqsConsumerConfig {
	queueUrl: string;
	queueName: string;
	region: string;
	waitTimeSeconds: number;
	maxMessages: number;
	visibilityTimeout: number;
	connections: number;
	metricsPollIntervalMs: number;
}

/**
 * SQS Queue Consumer
 * Matches Java SqsQueueConsumer behavior exactly
 */
export class SqsConsumer implements QueueConsumer {
	private readonly config: SqsConsumerConfig;
	private readonly client: SQSClient;
	private readonly handler: StandardBatchHandler;
	private readonly logger: Logger;
	private readonly instanceId: string;

	private running = false;
	private lastPollTimeMs = 0;
	private pollingTasks: Promise<void>[] = [];
	private metricsTask: Promise<void> | null = null;
	private abortController = new AbortController();

	// Track pending deletes for expired receipt handles.
	// Each entry has a timestamp so we can expire after 1 minute (avoid blocking deliberate resends).
	private readonly pendingDeleteSqsMessageIds = new Map<
		string,
		{ messageId: string; addedAt: number }
	>();

	// Queue metrics
	private pendingMessages = 0;
	private messagesNotVisible = 0;

	// Health check timeout (60 seconds)
	private static readonly POLL_TIMEOUT_MS = 60_000;

	// Adaptive delays
	// Empty batch: 1s — long poll already waited up to 20s, brief pause before re-poll
	// Partial batch (< maxMessages): 500ms — queue is draining
	// Full batch: 0ms — more messages likely waiting, re-poll immediately
	private static readonly EMPTY_BATCH_DELAY_MS = 1000;
	private static readonly PARTIAL_BATCH_DELAY_MS = 500;

	constructor(
		config: SqsConsumerConfig,
		handler: StandardBatchHandler,
		logger: Logger,
		instanceId: string,
	) {
		this.config = config;
		this.handler = handler;
		this.logger = logger.child({
			component: "SqsConsumer",
			queueUrl: config.queueUrl,
			queueName: config.queueName,
		});
		this.instanceId = instanceId;

		// Create SQS client
		this.client = new SQSClient({
			region: config.region,
			...(env.SQS_ENDPOINT && { endpoint: env.SQS_ENDPOINT }),
		});
	}

	/**
	 * Start consuming messages
	 */
	async start(): Promise<void> {
		if (this.running) {
			this.logger.warn("Consumer already running");
			return;
		}

		this.running = true;
		this.logger.info(
			{ connections: this.config.connections },
			"Starting SQS consumer",
		);

		// Start polling threads (one per connection)
		for (let i = 0; i < this.config.connections; i++) {
			const task = this.pollLoop(i);
			this.pollingTasks.push(task);
		}

		// Start metrics polling
		this.metricsTask = this.metricsLoop();
	}

	/**
	 * Stop consuming messages gracefully
	 */
	async stop(): Promise<void> {
		this.logger.info("Stopping SQS consumer");
		this.running = false;
		this.abortController.abort();

		// Wait for all polling tasks to complete
		await Promise.allSettled(this.pollingTasks);
		if (this.metricsTask) {
			await this.metricsTask;
		}

		this.pollingTasks = [];
		this.metricsTask = null;
		this.logger.info("SQS consumer stopped");
	}

	/**
	 * Get the queue identifier
	 */
	getQueueIdentifier(): string {
		return this.config.queueUrl;
	}

	/**
	 * Get consumer health status
	 */
	getHealth(): ConsumerHealth {
		const currentTimeMs = Date.now();
		const timeSinceLastPollMs =
			this.lastPollTimeMs > 0 ? currentTimeMs - this.lastPollTimeMs : -1;
		const timeSinceLastPollSeconds =
			timeSinceLastPollMs > 0 ? Math.floor(timeSinceLastPollMs / 1000) : -1;

		const isHealthy =
			this.running &&
			(this.lastPollTimeMs === 0 ||
				timeSinceLastPollMs < SqsConsumer.POLL_TIMEOUT_MS);

		return {
			mapKey: this.config.queueUrl,
			queueIdentifier: this.config.queueUrl,
			consumerQueueIdentifier: this.config.queueUrl,
			instanceId: this.instanceId,
			isHealthy,
			lastPollTimeMs: this.lastPollTimeMs,
			lastPollTime:
				this.lastPollTimeMs > 0
					? new Date(this.lastPollTimeMs).toISOString()
					: "never",
			timeSinceLastPollMs,
			timeSinceLastPollSeconds,
			isRunning: this.running,
		};
	}

	/**
	 * Get queue metrics
	 */
	getQueueMetrics(): QueueMetrics {
		return {
			pendingMessages: this.pendingMessages,
			messagesNotVisible: this.messagesNotVisible,
		};
	}

	/**
	 * Force an immediate metrics refresh from SQS
	 */
	async refreshMetrics(): Promise<void> {
		if (!this.running) return;
		try {
			const command = new GetQueueAttributesCommand({
				QueueUrl: this.config.queueUrl,
				AttributeNames: [
					"ApproximateNumberOfMessages",
					"ApproximateNumberOfMessagesNotVisible",
				],
			});
			const response = await this.client.send(command);
			const attrs = response.Attributes || {};
			this.pendingMessages = Number.parseInt(
				attrs["ApproximateNumberOfMessages"] || "0",
				10,
			);
			this.messagesNotVisible = Number.parseInt(
				attrs["ApproximateNumberOfMessagesNotVisible"] || "0",
				10,
			);
		} catch (error) {
			this.logger.error({ err: error }, "Error refreshing queue metrics");
		}
	}

	/**
	 * Check if consumer is running
	 */
	isRunning(): boolean {
		return this.running;
	}

	/**
	 * Check if consumer is fully stopped (not running and no pending tasks)
	 * Used by cleanup task to know when it's safe to remove from draining list
	 */
	isFullyStopped(): boolean {
		return !this.running && this.pollingTasks.length === 0;
	}

	/**
	 * Create a new consumer with the same configuration but a different handler
	 */
	recreate(handler: StandardBatchHandler): SqsConsumer {
		return new SqsConsumer(this.config, handler, this.logger, this.instanceId);
	}

	/**
	 * Main polling loop
	 */
	private async pollLoop(connectionIndex: number): Promise<void> {
		this.logger.debug({ connectionIndex }, "Poll loop started");

		while (this.running) {
			const loopStart = Date.now();

			try {
				// Record heartbeat
				this.lastPollTimeMs = Date.now();

				// Long poll for messages
				const command = new ReceiveMessageCommand({
					QueueUrl: this.config.queueUrl,
					MaxNumberOfMessages: this.config.maxMessages,
					WaitTimeSeconds: this.config.waitTimeSeconds,
					VisibilityTimeout: this.config.visibilityTimeout,
					MessageSystemAttributeNames: [
						"ApproximateReceiveCount",
						"MessageGroupId",
					],
					MessageAttributeNames: ["All"],
				});

				const response = await this.client.send(command, {
					abortSignal: this.abortController.signal,
				});
				const messages = response.Messages || [];

				this.logger.debug(
					{ messageCount: messages.length, connectionIndex },
					"Received messages from SQS",
				);

				if (messages.length > 0) {
					await this.processBatch(messages);
				}

				// Adaptive delay based on batch size
				const delay = this.getAdaptiveDelay(messages.length);
				if (delay > 0) {
					await sleep(delay, this.abortController.signal);
				}

				// Check for thread starvation
				const loopDuration = Date.now() - loopStart;
				if (loopDuration > 30_000) {
					this.logger.warn(
						{ loopDuration, connectionIndex },
						"Poll loop took longer than 30 seconds - possible thread starvation",
					);
				}
			} catch (error) {
				if (this.running) {
					this.logger.error(
						{ err: error, connectionIndex },
						"Error polling SQS",
					);
					await sleep(1000, this.abortController.signal);
				}
			}
		}

		this.logger.debug({ connectionIndex }, "Poll loop stopped");
	}

	/**
	 * Process a batch of messages
	 */
	private async processBatch(sqsMessages: Message[]): Promise<void> {
		const batchId = randomUUID();
		const receivedAt = new Date();
		const messages: QueueMessage[] = [];
		const callbacks = new Map<string, MessageCallbackFns>();
		const seenMessageIds = new Set<string>();

		for (const sqsMsg of sqsMessages) {
			if (!sqsMsg.Body || !sqsMsg.ReceiptHandle || !sqsMsg.MessageId) {
				this.logger.warn(
					"Received SQS message without body, receipt handle, or message ID",
				);
				continue;
			}

			// Check for pending deletes (messages that were processed but delete failed)
			const pendingEntry = this.pendingDeleteSqsMessageIds.get(sqsMsg.MessageId);
			if (pendingEntry) {
				if (Date.now() - pendingEntry.addedAt < 60_000) {
					// Within 1 minute — this is an SQS redelivery, delete it
					this.logger.info(
						{ sqsMessageId: sqsMsg.MessageId },
						"Found pending delete - deleting message",
					);
					await this.deleteMessage(sqsMsg.ReceiptHandle);
					this.pendingDeleteSqsMessageIds.delete(sqsMsg.MessageId);
					continue;
				}
				// Older than 1 minute — could be a deliberate resend, let it through
				this.pendingDeleteSqsMessageIds.delete(sqsMsg.MessageId);
			}

			// Parse message body
			let pointer: MessagePointer;
			try {
				const parsed = JSON.parse(sqsMsg.Body);
				pointer = {
					messageId: parsed.id || parsed.messageId || sqsMsg.MessageId,
					poolCode: parsed.poolCode || "DEFAULT",
					messageGroupId:
						parsed.messageGroupId ||
						sqsMsg.Attributes?.MessageGroupId ||
						"__DEFAULT__",
					payload: parsed.payload || parsed,
					authToken: parsed.authToken,
					callbackUrl: parsed.mediationTarget || parsed.callbackUrl,
					createdAt: parsed.createdAt,
					highPriority: parsed.highPriority === true,
				};
			} catch (error) {
				this.logger.warn(
					{ err: error, sqsMessageId: sqsMsg.MessageId },
					"Failed to parse message body - ACKing to prevent infinite retry",
				);
				await this.deleteMessage(sqsMsg.ReceiptHandle);
				continue;
			}

			// Within-batch deduplication
			if (seenMessageIds.has(pointer.messageId)) {
				this.logger.debug(
					{ messageId: pointer.messageId },
					"Duplicate message in batch - ACKing",
				);
				await this.deleteMessage(sqsMsg.ReceiptHandle);
				continue;
			}
			seenMessageIds.add(pointer.messageId);

			// Create queue message
			const queueMessage: QueueMessage = {
				brokerMessageId: sqsMsg.MessageId,
				messageId: pointer.messageId,
				receiptHandle: sqsMsg.ReceiptHandle,
				pointer,
				receiveCount: Number.parseInt(
					sqsMsg.Attributes?.ApproximateReceiveCount || "1",
					10,
				),
				receivedAt,
				batchId,
				queueId: this.config.queueUrl,
			};

			// Create callback with current receipt handle
			let currentReceiptHandle = sqsMsg.ReceiptHandle;
			const callback: MessageCallbackFns = {
				ack: async () => {
					await this.ackMessage(
						sqsMsg.MessageId!,
						currentReceiptHandle,
						pointer,
					);
				},
				nack: async (visibilityTimeoutSeconds?: number) => {
					await this.nackMessage(
						currentReceiptHandle,
						visibilityTimeoutSeconds,
					);
				},
				updateReceiptHandle: (newHandle: string) => {
					currentReceiptHandle = newHandle;
				},
				getReceiptHandle: () => currentReceiptHandle,
				inProgress: () => {},
			};

			messages.push(queueMessage);
			callbacks.set(sqsMsg.MessageId, callback);
		}

		if (messages.length === 0) {
			return;
		}

		// Create batch and pass to handler
		const batch: MessageBatch = {
			batchId,
			messages,
			queueId: this.config.queueUrl,
			receivedAt,
		};

		try {
			await this.handler(batch, callbacks);
		} catch (error) {
			this.logger.error({ err: error, batchId }, "Error handling batch");
			// NACK all messages in batch
			for (const callback of callbacks.values()) {
				try {
					await callback.nack();
				} catch (nackError) {
					this.logger.error({ err: nackError }, "Error NACKing message");
				}
			}
		}
	}

	/**
	 * ACK a message (delete from queue)
	 */
	private async ackMessage(
		sqsMessageId: string,
		receiptHandle: string,
		pointer: MessagePointer,
	): Promise<void> {
		try {
			await this.deleteMessage(receiptHandle);
			this.logger.debug({ messageId: pointer.messageId }, "Message ACKed");
		} catch (error) {
			// Check if receipt handle expired
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			if (
				errorMessage.includes("ReceiptHandleIsInvalid") ||
				errorMessage.includes("receipt handle has expired")
			) {
				this.logger.warn(
					{ messageId: pointer.messageId, sqsMessageId },
					"Receipt handle expired - adding to pending deletes",
				);
				this.pendingDeleteSqsMessageIds.set(sqsMessageId, {
					messageId: pointer.messageId,
					addedAt: Date.now(),
				});
			} else {
				this.logger.error(
					{ err: error, messageId: pointer.messageId },
					"Unexpected error deleting message",
				);
			}
		}
	}

	/**
	 * Delete a message from the queue
	 */
	private async deleteMessage(receiptHandle: string): Promise<void> {
		const command = new DeleteMessageCommand({
			QueueUrl: this.config.queueUrl,
			ReceiptHandle: receiptHandle,
		});
		await this.client.send(command);
	}

	/**
	 * NACK a message (change visibility for retry)
	 */
	private async nackMessage(
		receiptHandle: string,
		visibilityTimeoutSeconds = 30,
	): Promise<void> {
		try {
			// Clamp to SQS limits (0-43200 seconds)
			const timeout = Math.max(0, Math.min(43200, visibilityTimeoutSeconds));

			const command = new ChangeMessageVisibilityCommand({
				QueueUrl: this.config.queueUrl,
				ReceiptHandle: receiptHandle,
				VisibilityTimeout: timeout,
			});
			await this.client.send(command);
			this.logger.debug({ visibilityTimeout: timeout }, "Message NACKed");
		} catch (error) {
			this.logger.error({ err: error }, "Error changing message visibility");
		}
	}

	/**
	 * Get adaptive delay based on batch size
	 */
	private getAdaptiveDelay(messageCount: number): number {
		if (messageCount === 0) {
			return SqsConsumer.EMPTY_BATCH_DELAY_MS;
		}
		if (messageCount < this.config.maxMessages) {
			return SqsConsumer.PARTIAL_BATCH_DELAY_MS;
		}
		return 0; // Full batch - no delay
	}

	/**
	 * Metrics polling loop
	 */
	private async metricsLoop(): Promise<void> {
		this.logger.debug("Metrics loop started");

		while (this.running) {
			try {
				const command = new GetQueueAttributesCommand({
					QueueUrl: this.config.queueUrl,
					AttributeNames: [
						"ApproximateNumberOfMessages",
						"ApproximateNumberOfMessagesNotVisible",
					],
				});

				const response = await this.client.send(command, {
					abortSignal: this.abortController.signal,
				});
				const attrs = response.Attributes || {};

				this.pendingMessages = Number.parseInt(
					attrs["ApproximateNumberOfMessages"] || "0",
					10,
				);
				this.messagesNotVisible = Number.parseInt(
					attrs["ApproximateNumberOfMessagesNotVisible"] || "0",
					10,
				);

				this.logger.debug(
					{
						pendingMessages: this.pendingMessages,
						messagesNotVisible: this.messagesNotVisible,
					},
					"Queue metrics updated",
				);
			} catch (error) {
				if (this.running) {
					this.logger.error({ err: error }, "Error polling queue metrics");
				}
			}

			await sleep(this.config.metricsPollIntervalMs, this.abortController.signal);
		}

		this.logger.debug("Metrics loop stopped");
	}
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		if (signal?.aborted) {
			resolve();
			return;
		}
		const timer = setTimeout(resolve, ms);
		signal?.addEventListener("abort", () => {
			clearTimeout(timer);
			resolve();
		}, { once: true });
	});
}
