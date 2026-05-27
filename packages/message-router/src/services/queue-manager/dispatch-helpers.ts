import type { Logger } from "@flowcatalyst/logging";
import type { QueueMessage, QueueStats } from "@flowcatalyst/contracts";
import type {
	MessageCallback,
	MessageCallbackFns,
	ProcessPool,
} from "@flowcatalyst/queue-core";
import type { InFlightTracker } from "./in-flight-tracker.js";
import { recalculateSuccessRates } from "./queue-stats-helpers.js";

/**
 * A message that's been deduped, tracked in flight, and resolved to a
 * pool. The dispatch helpers below operate on collections of these.
 */
export interface RoutedMessage {
	message: QueueMessage;
	pipelineKey: string;
	resolvedPoolCode: string;
	resolvedPool: ProcessPool;
}

export interface DispatchDeps {
	inFlight: InFlightTracker;
	logger: Logger;
}

/**
 * IMMEDIATE dispatch mode: submit every message in the group
 * concurrently. There is no ordering dependency — if the pool rejects
 * one, only that message is NACKed; the rest still get submitted.
 *
 * Note: the body of the for-loop awaits `pool.submit`, so within a
 * single group we still serialise submissions. The "concurrent" part
 * refers to **groups** being independent of each other; failure of
 * one message doesn't gate the next.
 */
export async function submitGroupConcurrent(
	groupMessages: readonly RoutedMessage[],
	pool: ProcessPool,
	queueStat: QueueStats | undefined,
	deps: DispatchDeps,
): Promise<void> {
	const { inFlight, logger } = deps;
	for (const tracked of groupMessages) {
		const { message, pipelineKey } = tracked;
		const callback = inFlight.getCallback(pipelineKey);

		const poolCallback: MessageCallback = {
			ack: async () => {
				if (callback) await callback.ack();
				inFlight.untrack(pipelineKey, message.messageId);
				if (queueStat) {
					queueStat.totalConsumed++;
					queueStat.totalConsumed5min++;
					queueStat.totalConsumed30min++;
					recalculateSuccessRates(queueStat);
				}
			},
			nack: async (visibilityTimeoutSeconds?: number) => {
				if (callback) await callback.nack(visibilityTimeoutSeconds);
				inFlight.untrack(pipelineKey, message.messageId);
				if (queueStat) {
					queueStat.totalFailed++;
					queueStat.totalFailed5min++;
					queueStat.totalFailed30min++;
					recalculateSuccessRates(queueStat);
				}
			},
		};

		const accepted = await pool.submit(message, poolCallback);
		if (!accepted) {
			logger.warn(
				{
					poolCode: tracked.resolvedPoolCode,
					messageId: message.messageId,
				},
				"Pool rejected IMMEDIATE message (at capacity) - NACKing",
			);
			if (callback) await callback.nack(10);
			inFlight.untrack(pipelineKey, message.messageId);
		}
	}
}

/**
 * Strict-FIFO dispatch mode (BLOCK_ON_ERROR / NEXT_ON_ERROR / default).
 * If any submission is rejected, every subsequent message in the group
 * is NACKed (10s visibility timeout) so the broker re-delivers them
 * after the head clears.
 */
export async function submitGroupFifo(
	groupMessages: readonly RoutedMessage[],
	pool: ProcessPool,
	queueStat: QueueStats | undefined,
	deps: DispatchDeps,
): Promise<void> {
	const { inFlight, logger } = deps;
	let nackRemaining = false;
	const toNackFifo: Array<{
		pipelineKey: string;
		messageId: string;
		callback: MessageCallbackFns;
	}> = [];

	for (const tracked of groupMessages) {
		const { message, pipelineKey } = tracked;
		const callback = inFlight.getCallback(pipelineKey);

		if (nackRemaining) {
			if (callback) {
				toNackFifo.push({ pipelineKey, messageId: message.messageId, callback });
			} else {
				inFlight.untrack(pipelineKey, message.messageId);
			}
			continue;
		}

		const poolCallback: MessageCallback = {
			ack: async () => {
				if (callback) await callback.ack();
				inFlight.untrack(pipelineKey, message.messageId);
				if (queueStat) {
					queueStat.totalConsumed++;
					queueStat.totalConsumed5min++;
					queueStat.totalConsumed30min++;
					recalculateSuccessRates(queueStat);
				}
			},
			nack: async (visibilityTimeoutSeconds?: number) => {
				if (callback) await callback.nack(visibilityTimeoutSeconds);
				inFlight.untrack(pipelineKey, message.messageId);
				if (queueStat) {
					queueStat.totalFailed++;
					queueStat.totalFailed5min++;
					queueStat.totalFailed30min++;
					recalculateSuccessRates(queueStat);
				}
			},
		};

		const accepted = await pool.submit(message, poolCallback);
		if (!accepted) {
			logger.warn(
				{
					poolCode: tracked.resolvedPoolCode,
					messageId: message.messageId,
				},
				"Pool rejected message (at capacity) - NACKing remaining in group",
			);
			if (callback) await callback.nack(10);
			inFlight.untrack(pipelineKey, message.messageId);
			nackRemaining = true;
		}
	}

	if (toNackFifo.length > 0) {
		await Promise.allSettled(
			toNackFifo.map(async ({ pipelineKey, messageId, callback }) => {
				await callback.nack(10);
				inFlight.untrack(pipelineKey, messageId);
			}),
		);
	}
}
