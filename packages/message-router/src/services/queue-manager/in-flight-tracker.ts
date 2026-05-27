import type { Logger } from "@flowcatalyst/logging";
import type { InFlightMessage, QueueMessage } from "@flowcatalyst/contracts";
import type { MessageCallbackFns } from "@flowcatalyst/queue-core";
import type { WarningService } from "../warning-service.js";

/**
 * In-flight message metadata kept per pipeline key.
 */
export interface InFlightInfo {
	messageId: string;
	brokerMessageId: string;
	queueId: string;
	poolCode: string;
	addedAt: number;
}

export interface InFlightTrackerDeps {
	warnings: WarningService;
	logger: Logger;
	/** Sum of every pool's `maxQueueCapacity`, with a floor of 50. */
	totalPoolCapacity: () => number;
	/** Whether the owning manager is still running. */
	isRunning: () => boolean;
}

/**
 * Result of {@link InFlightTracker.dedupeAndTrack}. The caller picks
 * the next action — the tracker only owns map state and the dedup rule.
 *
 * - `physical_redelivery`: same broker message ID is already in flight.
 *   The receipt handle was swapped; the caller should `continue` (no
 *   ack/nack — the eventual ack uses the new handle).
 * - `requeue`: a *different* broker message ID for the same app message
 *   ID is already in flight. The caller should ACK the duplicate.
 * - `tracked`: not seen before. The caller proceeds with routing.
 */
export type DedupResult =
	| { kind: "physical_redelivery" }
	| { kind: "requeue"; ackCallback: MessageCallbackFns | undefined }
	| { kind: "tracked" };

/**
 * Owns the three correlated maps that track every message currently
 * being processed by the router:
 *
 * - `messages`: pipeline-key -> metadata (used by leak checks, the
 *   admin in-flight endpoint, and shutdown NACKs).
 * - `callbacks`: pipeline-key -> broker callback (ack/nack/extend).
 * - `appIdToKey`: app message ID -> pipeline key, for O(1) requeue
 *   detection and external presence checks.
 *
 * The maps are kept in lock-step: every `track` adds to all three,
 * every `untrack` removes from all three.
 */
export class InFlightTracker {
	private readonly messages = new Map<string, InFlightInfo>();
	private readonly callbacks = new Map<string, MessageCallbackFns>();
	private readonly appIdToKey = new Map<string, string>();

	private readonly deps: InFlightTrackerDeps;
	constructor(deps: InFlightTrackerDeps) {
		this.deps = deps;
	}

	/**
	 * Phase 1 deduplication + tracking. Encapsulates physical-redelivery,
	 * requeue detection, and the new-message insertion as one atomic
	 * step so callers don't have to hold all three maps in their head.
	 */
	dedupeAndTrack(
		message: QueueMessage,
		callback: MessageCallbackFns | undefined,
		queueId: string,
	): DedupResult {
		const pipelineKey = message.brokerMessageId;

		if (this.messages.has(pipelineKey)) {
			const stored = this.callbacks.get(pipelineKey);
			if (stored && callback) {
				const newHandle = callback.getReceiptHandle();
				if (newHandle) {
					stored.updateReceiptHandle(newHandle);
					this.deps.logger.debug(
						{ brokerMessageId: message.brokerMessageId },
						"Physical redelivery detected - swapped receipt handle, no SQS action needed",
					);
				}
			}
			return { kind: "physical_redelivery" };
		}

		const existingKey = this.appIdToKey.get(message.messageId);
		if (existingKey && existingKey !== pipelineKey) {
			this.deps.logger.debug(
				{
					messageId: message.messageId,
					existingKey,
					newKey: pipelineKey,
				},
				"Requeue detected - ACKing duplicate",
			);
			return { kind: "requeue", ackCallback: callback };
		}

		this.messages.set(pipelineKey, {
			messageId: message.messageId,
			brokerMessageId: message.brokerMessageId,
			queueId,
			poolCode: message.pointer.poolCode,
			addedAt: Date.now(),
		});
		this.appIdToKey.set(message.messageId, pipelineKey);
		if (callback) {
			this.callbacks.set(pipelineKey, callback);
		}
		return { kind: "tracked" };
	}

	/** Return the broker callback for an in-flight message. */
	getCallback(pipelineKey: string): MessageCallbackFns | undefined {
		return this.callbacks.get(pipelineKey);
	}

	/** Drop a message from all three maps. Call once it's acked or nacked. */
	untrack(pipelineKey: string, appMessageId: string): void {
		this.messages.delete(pipelineKey);
		this.callbacks.delete(pipelineKey);
		this.appIdToKey.delete(appMessageId);
	}

	/** Number of in-flight messages — used by leak check. */
	size(): number {
		return this.messages.size;
	}

	/** Drop everything. Called during shutdown after NACKs are dispatched. */
	clear(): void {
		this.messages.clear();
		this.callbacks.clear();
		this.appIdToKey.clear();
	}

	/**
	 * Iterate over (pipelineKey, callback) pairs. Used at shutdown to
	 * NACK everything still in flight.
	 */
	forEachCallback(fn: (pipelineKey: string, cb: MessageCallbackFns) => void): void {
		for (const [key, cb] of this.callbacks) fn(key, cb);
	}

	/**
	 * Leak detector — fires a warning if pipeline size exceeds total
	 * pool capacity (>50 floor). Idempotent; safe to call on every tick.
	 */
	checkForLeaks(): void {
		if (!this.deps.isRunning()) return;

		const pipelineSize = this.messages.size;
		const totalCapacity = Math.max(this.deps.totalPoolCapacity(), 50);

		if (pipelineSize > totalCapacity) {
			this.deps.warnings.add(
				"PIPELINE_MAP_LEAK",
				"WARNING",
				`In-flight tracker size (${pipelineSize}) exceeds total pool capacity (${totalCapacity})`,
				"QueueManager",
			);
			this.deps.logger.warn(
				{ pipelineSize, totalCapacity },
				"LEAK DETECTION: in-flight tracker size exceeds total capacity",
			);
		}
	}

	/** O(1) presence check by **app** message ID. */
	isInFlightByAppId(appMessageId: string): boolean {
		const pipelineKey = this.appIdToKey.get(appMessageId);
		if (!pipelineKey) return false;
		return this.messages.has(pipelineKey);
	}

	/** Batch presence check; each lookup is O(1). */
	areInFlightByAppIds(appMessageIds: string[]): Record<string, boolean> {
		const result: Record<string, boolean> = {};
		for (const id of appMessageIds) {
			result[id] = this.isInFlightByAppId(id);
		}
		return result;
	}

	/** Presence check by pipeline key (broker message ID). */
	isPipelineKeyInFlight(pipelineKey: string): boolean {
		return this.messages.has(pipelineKey);
	}

	/**
	 * Snapshot for the admin/HTTP endpoint. Sorted by elapsed time
	 * (longest first) and capped at `limit`.
	 */
	getMessages(
		limit: number,
		filters: { messageId?: string; poolCode?: string } = {},
	): InFlightMessage[] {
		const now = Date.now();
		let messages = Array.from(this.messages.values()).map((info) => ({
			messageId: info.messageId,
			brokerMessageId: info.brokerMessageId,
			queueId: info.queueId,
			addedToInPipelineAt: new Date(info.addedAt).toISOString(),
			elapsedTimeMs: now - info.addedAt,
			poolCode: info.poolCode,
		}));

		if (filters.messageId) {
			const needle = filters.messageId.toLowerCase();
			messages = messages.filter(
				(m) =>
					m.messageId.toLowerCase().includes(needle) ||
					m.brokerMessageId.toLowerCase().includes(needle),
			);
		}

		if (filters.poolCode) {
			const needle = filters.poolCode.toLowerCase();
			messages = messages.filter((m) => m.poolCode.toLowerCase() === needle);
		}

		messages.sort((a, b) => b.elapsedTimeMs - a.elapsedTimeMs);
		return messages.slice(0, limit);
	}
}
