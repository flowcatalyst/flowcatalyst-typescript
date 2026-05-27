import type {
	ConsumerHealthResponse,
	QueueStats,
} from "@flowcatalyst/contracts";
import type { ConsumerHealth, QueueConsumer } from "@flowcatalyst/queue-core";
import type { EmbeddedQueue } from "../../embedded/index.js";
import { extractQueueName } from "./queue-stats-helpers.js";

const EMBEDDED_QUEUE_NAME = "embedded-queue";

export interface StatsReportingDeps {
	readonly consumers: Map<string, QueueConsumer>;
	readonly queueStats: Map<string, QueueStats>;
	embeddedQueue(): EmbeddedQueue | null;
}

/**
 * Pull current broker metrics into the queue-stat rows, then return a
 * shallow-copied snapshot. Matches the Java response shape.
 */
export function getQueueStats(
	deps: StatsReportingDeps,
): Record<string, QueueStats> {
	const { consumers, queueStats } = deps;

	for (const [queueId, consumer] of consumers) {
		// Try extracted queue name first (SQS URLs), then the raw key
		const queueName = extractQueueName(queueId);
		const stats = queueStats.get(queueName) ?? queueStats.get(queueId);
		if (stats) {
			const metrics = consumer.getQueueMetrics();
			stats.pendingMessages = metrics.pendingMessages;
			stats.messagesNotVisible = metrics.messagesNotVisible;
			stats.currentSize = metrics.pendingMessages;
		}
	}

	const embeddedQueue = deps.embeddedQueue();
	if (embeddedQueue) {
		const embeddedMetrics = embeddedQueue.getConsumerMetrics();
		const embeddedSnapshot = embeddedQueue.getStats();
		const stats = queueStats.get(EMBEDDED_QUEUE_NAME);
		if (stats && embeddedMetrics) {
			stats.pendingMessages = embeddedMetrics.pendingMessages;
			stats.messagesNotVisible = embeddedMetrics.messagesNotVisible;
			stats.currentSize = embeddedSnapshot.visibleMessages;
		}
	}

	const result: Record<string, QueueStats> = {};
	for (const [name, stats] of queueStats) {
		result[name] = { ...stats };
	}
	return result;
}

/** Aggregate consumer health across SQS / ActiveMQ / NATS + embedded. */
export function getConsumerHealth(deps: StatsReportingDeps): ConsumerHealthResponse {
	const currentTimeMs = Date.now();
	const consumers: Record<string, ConsumerHealth> = {};

	for (const [queueId, consumer] of deps.consumers) {
		consumers[queueId] = consumer.getHealth();
	}

	const embeddedQueue = deps.embeddedQueue();
	if (embeddedQueue) {
		const health = embeddedQueue.getConsumerHealth();
		if (health) {
			consumers[EMBEDDED_QUEUE_NAME] = health;
		}
	}

	return {
		currentTimeMs,
		currentTime: new Date(currentTimeMs).toISOString(),
		consumers,
	};
}

/**
 * Ask every consumer + the embedded queue to refresh its broker metrics.
 * Used when the dashboard user clicks "Refresh".
 */
export async function refreshQueueMetrics(deps: StatsReportingDeps): Promise<void> {
	const promises: Promise<void>[] = [];
	for (const consumer of deps.consumers.values()) {
		promises.push(consumer.refreshMetrics());
	}
	const embeddedQueue = deps.embeddedQueue();
	if (embeddedQueue) {
		promises.push(embeddedQueue.refreshConsumerMetrics());
	}
	await Promise.allSettled(promises);
}
