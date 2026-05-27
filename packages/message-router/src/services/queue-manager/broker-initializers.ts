import type { Logger } from "@flowcatalyst/logging";
import type {
	MessageBatch,
	PoolConfig,
	QueueStats,
} from "@flowcatalyst/contracts";
import {
	HttpMediator,
	ProcessPool,
	type MessageCallbackFns,
	type QueueConsumer,
} from "@flowcatalyst/queue-core";
import {
	SqsConsumer,
	type SqsConsumerConfig,
} from "../../consumers/sqs-consumer.js";
import {
	ActiveMqConsumer,
	type ActiveMqConsumerConfig,
} from "../../consumers/activemq-consumer.js";
import {
	NatsConsumer,
	type NatsConsumerConfig,
} from "../../consumers/nats-consumer.js";
import { EmbeddedQueue } from "../../embedded/index.js";
import { env } from "../../env.js";
import { createEmptyQueueStats, extractQueueName } from "./queue-stats-helpers.js";

/**
 * The slice of manager state the broker initializers need. The manager
 * passes a reference to itself (it implements this interface) so the
 * helpers can register pools, consumers, queues, and the embedded queue
 * without us widening the manager's public surface.
 */
export interface BrokerInitContext {
	readonly logger: Logger;
	readonly httpMediator: HttpMediator;
	readonly processPools: Map<string, ProcessPool>;
	readonly consumers: Map<string, QueueConsumer>;
	readonly queueStats: Map<string, QueueStats>;
	setEmbeddedQueue(queue: EmbeddedQueue): void;
	handleBatch(
		batch: MessageBatch,
		callbacks: Map<string, MessageCallbackFns>,
	): Promise<void>;
}

/** Default three-tier pools (HIGH / MEDIUM / LOW) used by every non-SQS mode. */
const DEFAULT_PRIORITY_POOLS: readonly PoolConfig[] = [
	{ code: "POOL-HIGH", concurrency: 10, rateLimitPerMinute: null },
	{ code: "POOL-MEDIUM", concurrency: 10, rateLimitPerMinute: null },
	{ code: "POOL-LOW", concurrency: 10, rateLimitPerMinute: null },
];

function registerDefaultPools(ctx: BrokerInitContext): void {
	for (const cfg of DEFAULT_PRIORITY_POOLS) {
		ctx.processPools.set(cfg.code, new ProcessPool(cfg, ctx.httpMediator, ctx.logger));
	}
}

/**
 * Embedded mode — SQLite-backed in-process queue. Used for local dev
 * and standalone deployments without a real broker.
 */
export async function initializeEmbeddedMode(ctx: BrokerInitContext): Promise<void> {
	const queueName = "embedded-queue";

	const embeddedQueue = new EmbeddedQueue(
		{
			dbPath: env.EMBEDDED_DB_PATH,
			queueName,
			visibilityTimeoutSeconds: env.EMBEDDED_VISIBILITY_TIMEOUT_SECONDS,
			receiveTimeoutMs: env.EMBEDDED_RECEIVE_TIMEOUT_MS,
			maxMessages: env.EMBEDDED_MAX_MESSAGES,
			metricsPollIntervalMs: env.EMBEDDED_METRICS_POLL_INTERVAL_MS,
		},
		ctx.logger,
		env.INSTANCE_ID,
	);
	await embeddedQueue.initialize();
	ctx.setEmbeddedQueue(embeddedQueue);

	ctx.queueStats.set(queueName, createEmptyQueueStats(queueName));
	registerDefaultPools(ctx);

	await embeddedQueue.startConsumer((batch, callbacks) =>
		ctx.handleBatch(batch, callbacks),
	);

	ctx.logger.info(
		{ dbPath: env.EMBEDDED_DB_PATH, queueName },
		"Embedded queue initialized",
	);
}

/**
 * ActiveMQ mode — three fixed-name STOMP queues for priority tiers.
 */
export async function initializeActiveMqMode(ctx: BrokerInitContext): Promise<void> {
	const queueNames = [
		"flow-catalyst-high-priority",
		"flow-catalyst-medium-priority",
		"flow-catalyst-low-priority",
	];

	registerDefaultPools(ctx);

	for (const queueName of queueNames) {
		const consumerConfig: ActiveMqConsumerConfig = {
			host: env.ACTIVEMQ_HOST,
			port: env.ACTIVEMQ_PORT,
			username: env.ACTIVEMQ_USERNAME,
			password: env.ACTIVEMQ_PASSWORD,
			queueName,
			connections: env.DEFAULT_CONNECTIONS,
			receiveTimeoutMs: env.ACTIVEMQ_RECEIVE_TIMEOUT_MS,
			metricsPollIntervalMs: env.SYNC_INTERVAL_MS,
			prefetchCount: env.ACTIVEMQ_PREFETCH_COUNT,
			redeliveryDelayMs: env.ACTIVEMQ_REDELIVERY_DELAY_MS,
		};

		const consumer = new ActiveMqConsumer(
			consumerConfig,
			(batch, callbacks) => ctx.handleBatch(batch, callbacks),
			ctx.logger,
			env.INSTANCE_ID,
		);

		await consumer.start();
		ctx.consumers.set(queueName, consumer);
		ctx.queueStats.set(queueName, createEmptyQueueStats(queueName));
	}

	ctx.logger.info(
		{
			host: env.ACTIVEMQ_HOST,
			port: env.ACTIVEMQ_PORT,
			queues: queueNames,
		},
		"ActiveMQ mode initialized",
	);
}

/**
 * NATS JetStream mode — single durable consumer keyed by stream/consumer name.
 */
export async function initializeNatsMode(ctx: BrokerInitContext): Promise<void> {
	registerDefaultPools(ctx);

	const consumerConfig: NatsConsumerConfig = {
		servers: env.NATS_SERVERS,
		connectionName: env.NATS_CONNECTION_NAME,
		username: env.NATS_USERNAME,
		password: env.NATS_PASSWORD,
		streamName: env.NATS_STREAM_NAME,
		consumerName: env.NATS_CONSUMER_NAME,
		subject: env.NATS_SUBJECT,
		maxMessagesPerPoll: env.NATS_MAX_MESSAGES_PER_POLL,
		pollTimeoutSeconds: env.NATS_POLL_TIMEOUT_SECONDS,
		ackWaitSeconds: env.NATS_ACK_WAIT_SECONDS,
		maxDeliver: env.NATS_MAX_DELIVER,
		maxAckPending: env.NATS_MAX_ACK_PENDING,
		storageType: env.NATS_STORAGE_TYPE,
		replicas: env.NATS_REPLICAS,
		maxAgeDays: env.NATS_MAX_AGE_DAYS,
		metricsPollIntervalMs: env.SYNC_INTERVAL_MS,
	};

	const consumer = new NatsConsumer(
		consumerConfig,
		(batch, callbacks) => ctx.handleBatch(batch, callbacks),
		ctx.logger,
		env.INSTANCE_ID,
	);

	await consumer.start();
	const queueId = `${env.NATS_STREAM_NAME}:${env.NATS_CONSUMER_NAME}`;
	ctx.consumers.set(queueId, consumer);
	ctx.queueStats.set(queueId, createEmptyQueueStats(queueId));

	ctx.logger.info(
		{
			servers: env.NATS_SERVERS,
			stream: env.NATS_STREAM_NAME,
			consumer: env.NATS_CONSUMER_NAME,
		},
		"NATS mode initialized",
	);
}

/**
 * Build (but don't start) an SQS consumer for one queue. Used by the
 * config-sync path that creates consumers lazily as queues appear in
 * the platform config.
 */
export function createSqsConsumer(
	ctx: BrokerInitContext,
	queueUrl: string,
	queueName: string,
	connections: number,
): SqsConsumer {
	const config: SqsConsumerConfig = {
		queueUrl,
		queueName: queueName || extractQueueName(queueUrl),
		region: env.AWS_REGION,
		waitTimeSeconds: 20,
		maxMessages: 10,
		visibilityTimeout: 30,
		connections,
		metricsPollIntervalMs: Math.min(env.SYNC_INTERVAL_MS, 60_000),
	};

	return new SqsConsumer(
		config,
		(batch, callbacks) => ctx.handleBatch(batch, callbacks),
		ctx.logger,
		env.INSTANCE_ID,
	);
}
