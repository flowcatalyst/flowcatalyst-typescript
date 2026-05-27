import type { Logger } from "@flowcatalyst/logging";
import type {
	PoolConfig,
	QueueStats,
} from "@flowcatalyst/contracts";
import {
	HttpMediator,
	ProcessPool,
	type QueueConsumer,
} from "@flowcatalyst/queue-core";
import type { WarningService } from "../warning-service.js";
import type { QueueValidationService } from "../queue-validation-service.js";
import type { MessageRouterConfig } from "../../clients/platform-config-client.js";
import { env } from "../../env.js";
import {
	createSqsConsumer as buildSqsConsumer,
	type BrokerInitContext,
} from "./broker-initializers.js";
import {
	createEmptyQueueStats,
	extractQueueName,
} from "./queue-stats-helpers.js";

/**
 * Slice of manager state the applicator mutates. The applicator
 * promises to keep the serialization invariant: only one in-flight
 * `apply` at a time, through its internal `syncChain` promise.
 */
export interface ConfigApplyContext {
	readonly logger: Logger;
	readonly warnings: WarningService;
	readonly queueValidation: QueueValidationService;
	readonly httpMediator: HttpMediator;

	readonly processPools: Map<string, ProcessPool>;
	readonly drainingPools: Map<string, ProcessPool>;
	readonly consumers: Map<string, QueueConsumer>;
	readonly drainingConsumers: Map<string, QueueConsumer>;
	readonly queueStats: Map<string, QueueStats>;

	readonly maxPools: number;
	readonly poolWarningThreshold: number;

	setCurrentConfig(config: MessageRouterConfig): void;
	brokerInitContext(): BrokerInitContext;
}

/**
 * Applies a {@link MessageRouterConfig} to the queue manager's runtime
 * state — process pools, SQS consumers, and queue stats. Calls are
 * serialized through an internal promise chain so concurrent platform
 * config-pushes can't interleave.
 *
 * Matches the Java `QueueManager.syncConfiguration` lifecycle.
 */
export class ConfigApplicator {
	private syncChain: Promise<void> = Promise.resolve();
	private readonly ctx: ConfigApplyContext;

	constructor(ctx: ConfigApplyContext) {
		this.ctx = ctx;
	}

	/**
	 * Apply a config. Serialized via the promise chain — caller's
	 * `await` resolves only after this particular config has been
	 * applied (or its sync threw).
	 */
	async apply(config: MessageRouterConfig): Promise<void> {
		this.syncChain = this.syncChain.then(() =>
			this.doApply(config).catch((err) => {
				this.ctx.logger.error({ err }, "Configuration sync failed");
			}),
		);
		await this.syncChain;
	}

	private async doApply(config: MessageRouterConfig): Promise<void> {
		const { logger, warnings, queueValidation, queueStats } = this.ctx;

		logger.info(
			{
				queues: config.queues.length,
				pools: config.processingPools.length,
				connections: config.connections,
			},
			"Applying configuration",
		);

		this.ctx.setCurrentConfig(config);

		// Filter queues with valid identifiers, warn about invalid ones
		const validQueueConfigs: Array<{ queueUri: string } | { queueName: string }> = [];
		for (const q of config.queues) {
			const queueUri = q.queueUri?.trim() || null;
			const queueName = q.queueName?.trim() || null;

			if (queueUri) {
				validQueueConfigs.push({ queueUri, ...(queueName && { queueName }) });
			} else if (queueName) {
				validQueueConfigs.push({ queueName });
			} else {
				warnings.add(
					"CONFIGURATION",
					"WARNING",
					"Queue configuration missing both queueUri and queueName - skipping validation",
					"QueueManagerService",
				);
				logger.warn(
					{ queue: q },
					"Queue configuration missing identifier, skipping",
				);
			}
		}

		// Validate queues (raises warnings for missing queues but doesn't stop)
		const validationResult =
			await queueValidation.validateQueues(validQueueConfigs);
		if (validationResult.failed > 0) {
			logger.warn(
				{
					validated: validationResult.validated,
					failed: validationResult.failed,
				},
				"Some queues failed validation (continuing with available queues)",
			);
		}

		await this.syncProcessPools(config.processingPools);

		if (env.QUEUE_TYPE === "SQS") {
			await this.syncSqsConsumers(config);
		}

		// Backfill stats rows for any newly-discovered queues
		for (const queue of config.queues) {
			const queueName = queue.queueName || extractQueueName(queue.queueUri);
			if (!queueStats.has(queueName)) {
				queueStats.set(queueName, createEmptyQueueStats(queueName));
			}
		}
	}

	private async syncProcessPools(poolConfigs: PoolConfig[]): Promise<void> {
		const { logger, warnings, processPools, drainingPools, httpMediator, maxPools, poolWarningThreshold } = this.ctx;
		const newPoolConfigs = new Map(poolConfigs.map((p) => [p.code, p]));

		// Step 1: Handle pool changes - update in-place or move to draining
		for (const [code, existingPool] of processPools) {
			const newConfig = newPoolConfigs.get(code);

			if (!newConfig) {
				logger.info(
					{
						poolCode: code,
						queueSize: existingPool.getStats().queueSize,
						activeWorkers: existingPool.getStats().activeWorkers,
					},
					"Pool removed from config - draining asynchronously",
				);
				existingPool.drain();
				processPools.delete(code);
				drainingPools.set(code, existingPool);
			} else {
				const stats = existingPool.getStats();
				const concurrencyChanged = newConfig.concurrency !== stats.maxConcurrency;
				const rateLimitChanged =
					newConfig.rateLimitPerMinute !== existingPool.getConfig().rateLimitPerMinute;

				if (concurrencyChanged || rateLimitChanged) {
					logger.info(
						{
							poolCode: code,
							oldConcurrency: stats.maxConcurrency,
							newConcurrency: newConfig.concurrency,
							rateLimitChanged,
						},
						"Updating pool configuration in-place",
					);
					existingPool.updateConfig(newConfig);
				}
			}
		}

		// Step 2: Create new pools (with limit checks)
		for (const poolConfig of poolConfigs) {
			if (processPools.has(poolConfig.code)) continue;

			const currentPoolCount = processPools.size;

			if (currentPoolCount >= maxPools) {
				logger.error(
					{
						poolCode: poolConfig.code,
						currentCount: currentPoolCount,
						maxPools,
					},
					"Cannot create pool: maximum pool limit reached",
				);
				warnings.add(
					"POOL_LIMIT",
					"CRITICAL",
					`Max pool limit reached (${currentPoolCount}/${maxPools}) - cannot create pool [${poolConfig.code}]`,
					"QueueManager",
				);
				continue;
			}

			if (currentPoolCount >= poolWarningThreshold) {
				logger.warn(
					{
						currentCount: currentPoolCount,
						maxPools,
						threshold: poolWarningThreshold,
					},
					"Pool count approaching limit",
				);
				warnings.add(
					"POOL_LIMIT",
					"WARNING",
					`Pool count ${currentPoolCount} approaching limit ${maxPools}`,
					"QueueManager",
				);
			}

			const queueCapacity = Math.max(poolConfig.concurrency * 20, 50);
			logger.info(
				{
					poolCode: poolConfig.code,
					concurrency: poolConfig.concurrency,
					queueCapacity,
					poolNumber: currentPoolCount + 1,
					maxPools,
				},
				"Creating new process pool",
			);

			processPools.set(
				poolConfig.code,
				new ProcessPool(poolConfig, httpMediator, logger),
			);
		}
	}

	private async syncSqsConsumers(config: MessageRouterConfig): Promise<void> {
		const { logger, consumers, drainingConsumers } = this.ctx;
		const activeQueueUris = new Set(config.queues.map((q) => q.queueUri));

		// Phase out consumers for queues no longer in config (async draining)
		for (const [queueUri, consumer] of consumers) {
			if (!activeQueueUris.has(queueUri)) {
				logger.info({ queueUri }, "Phasing out consumer for removed queue");
				consumer.stop();
				consumers.delete(queueUri);
				drainingConsumers.set(queueUri, consumer);
				logger.info({ queueUri }, "Consumer moved to draining state");
			}
		}

		// Start consumers for new queues
		for (const queue of config.queues) {
			if (consumers.has(queue.queueUri)) continue;

			logger.info({ queueUri: queue.queueUri }, "Starting consumer for new queue");
			const consumer = buildSqsConsumer(
				this.ctx.brokerInitContext(),
				queue.queueUri,
				queue.queueName || "",
				queue.connections || config.connections,
			);
			await consumer.start();
			consumers.set(queue.queueUri, consumer);
		}
	}
}
