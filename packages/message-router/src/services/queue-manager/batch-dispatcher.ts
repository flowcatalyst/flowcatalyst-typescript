import type { Logger } from "@flowcatalyst/logging";
import type {
	MessageBatch,
	QueueStats,
} from "@flowcatalyst/contracts";
import {
	HttpMediator,
	ProcessPool,
	type MessageCallbackFns,
} from "@flowcatalyst/queue-core";
import type { WarningService } from "../warning-service.js";
import type { InFlightTracker } from "./in-flight-tracker.js";
import {
	submitGroupConcurrent,
	submitGroupFifo,
	type RoutedMessage,
} from "./dispatch-helpers.js";
import { extractQueueName } from "./queue-stats-helpers.js";

export interface BatchDispatcherDeps {
	readonly logger: Logger;
	readonly warnings: WarningService;
	readonly inFlight: InFlightTracker;
	readonly queueStats: Map<string, QueueStats>;
	readonly processPools: Map<string, ProcessPool>;
	readonly httpMediator: HttpMediator;
}

/** The "DEFAULT-POOL" fallback that absorbs messages with unknown pool codes. */
const DEFAULT_POOL_CODE = "DEFAULT-POOL";
const DEFAULT_POOL_CONCURRENCY = 20;

/**
 * Unified batch handler for all consumer types (SQS, NATS, ActiveMQ,
 * Embedded). All consumers normalize broker messages into
 * `MessageBatch` + `MessageCallbackFns` before they get here.
 *
 * Three-phase routing algorithm, matches the Java
 * `QueueManager.routeMessageBatch`:
 *
 *   Phase 1: Deduplication (physical redelivery + logical requeue)
 *   Phase 2: Pool capacity pre-check (batch-level rejection)
 *   Phase 3: Per-group routing (IMMEDIATE = concurrent; else FIFO)
 */
export class BatchDispatcher {
	private readonly deps: BatchDispatcherDeps;
	constructor(deps: BatchDispatcherDeps) {
		this.deps = deps;
	}

	async dispatch(
		batch: MessageBatch,
		callbacks: Map<string, MessageCallbackFns>,
	): Promise<void> {
		const { inFlight, logger, warnings, queueStats, processPools } = this.deps;
		const queueName = extractQueueName(batch.queueId);
		const queueStat = queueStats.get(queueName);

		// Snapshot pools so this batch routes consistently even if a
		// concurrent config-sync mutates processPools mid-flight.
		const poolSnapshot = new Map(processPools);

		// ── Phase 1: Deduplication ──────────────────────────────────────
		const messagesToRoute: RoutedMessage[] = [];

		for (const message of batch.messages) {
			const pipelineKey = message.brokerMessageId;
			const callback = callbacks.get(message.brokerMessageId);

			if (callback) callback.inProgress();

			const dedup = inFlight.dedupeAndTrack(message, callback, batch.queueId);
			if (dedup.kind === "physical_redelivery") {
				// Message stays in SQS with natural visibility timeout; the
				// receipt-handle swap ensures the eventual ACK uses the new handle.
				continue;
			}
			if (dedup.kind === "requeue") {
				if (dedup.ackCallback) await dedup.ackCallback.ack();
				continue;
			}

			if (queueStat) {
				queueStat.totalMessages++;
				queueStat.totalMessages5min++;
				queueStat.totalMessages30min++;
			}

			let resolvedPoolCode = message.pointer.poolCode;
			let resolvedPool = poolSnapshot.get(resolvedPoolCode);
			if (!resolvedPool) {
				logger.warn(
					{ poolCode: resolvedPoolCode, messageId: message.messageId },
					"No pool found, routing to DEFAULT-POOL",
				);
				warnings.add(
					"ROUTING",
					"WARNING",
					`No pool found for code [${resolvedPoolCode}], using default pool`,
					"QueueManager",
				);
				resolvedPoolCode = DEFAULT_POOL_CODE;
				resolvedPool = this.getOrCreateDefaultPool();
			}

			messagesToRoute.push({
				message,
				pipelineKey,
				resolvedPoolCode,
				resolvedPool,
			});
		}

		// ── Phase 2: Batch-level pool capacity pre-check ────────────────
		const messagesByPool = new Map<string, RoutedMessage[]>();
		for (const tracked of messagesToRoute) {
			const existing = messagesByPool.get(tracked.resolvedPoolCode) || [];
			existing.push(tracked);
			messagesByPool.set(tracked.resolvedPoolCode, existing);
		}

		const toNackPoolFull: RoutedMessage[] = [];
		const acceptedByPool = new Map<string, RoutedMessage[]>();

		for (const [poolCode, poolMessages] of messagesByPool) {
			const pool = poolMessages[0]!.resolvedPool;
			const stats = pool.getStats();
			const availableCapacity = stats.maxQueueCapacity - stats.queueSize;

			if (availableCapacity < poolMessages.length) {
				logger.warn(
					{
						poolCode,
						batchSize: poolMessages.length,
						availableCapacity,
					},
					"Pool cannot accept batch — NACKing all messages for this pool",
				);
				warnings.add(
					"QUEUE_FULL",
					"WARNING",
					`Pool [${poolCode}] buffer full — batch of ${poolMessages.length} NACKed (available: ${availableCapacity})`,
					"QueueManager",
				);
				toNackPoolFull.push(...poolMessages);
			} else {
				acceptedByPool.set(poolCode, poolMessages);
			}
		}

		if (toNackPoolFull.length > 0) {
			await Promise.allSettled(
				toNackPoolFull.map(async (tracked) => {
					const callback = inFlight.getCallback(tracked.pipelineKey);
					if (callback) await callback.nack(10);
					inFlight.untrack(tracked.pipelineKey, tracked.message.messageId);
				}),
			);
		}

		// ── Phase 3: Per-group routing ──────────────────────────────────
		for (const [_poolCode, poolMessages] of acceptedByPool) {
			const pool = poolMessages[0]!.resolvedPool;

			const messagesByGroup = new Map<string, RoutedMessage[]>();
			for (const tracked of poolMessages) {
				const groupId = tracked.message.pointer.messageGroupId || "__DEFAULT__";
				const existing = messagesByGroup.get(groupId) || [];
				existing.push(tracked);
				messagesByGroup.set(groupId, existing);
			}

			for (const [_groupId, groupMessages] of messagesByGroup) {
				const groupDispatchMode = groupMessages[0]!.message.pointer.dispatchMode;
				const isImmediate = groupDispatchMode === "IMMEDIATE";

				const helperDeps = { inFlight, logger };
				if (isImmediate) {
					await submitGroupConcurrent(groupMessages, pool, queueStat, helperDeps);
				} else {
					await submitGroupFifo(groupMessages, pool, queueStat, helperDeps);
				}
			}
		}
	}

	/**
	 * Lazily create the DEFAULT-POOL fallback. Adds it to processPools
	 * so subsequent stats getters see it.
	 */
	private getOrCreateDefaultPool(): ProcessPool {
		const { processPools, httpMediator, logger } = this.deps;
		let pool = processPools.get(DEFAULT_POOL_CODE);
		if (!pool) {
			logger.info(
				{ poolCode: DEFAULT_POOL_CODE, concurrency: DEFAULT_POOL_CONCURRENCY },
				"Creating DEFAULT-POOL",
			);
			pool = new ProcessPool(
				{
					code: DEFAULT_POOL_CODE,
					concurrency: DEFAULT_POOL_CONCURRENCY,
					rateLimitPerMinute: null,
				},
				httpMediator,
				logger,
			);
			processPools.set(DEFAULT_POOL_CODE, pool);
		}
		return pool;
	}
}
