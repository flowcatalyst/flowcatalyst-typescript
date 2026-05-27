import type { QueueStats } from "@flowcatalyst/contracts";

/**
 * Strip the SQS URL prefix from a queue URI: returns the last path
 * segment, or the input unchanged if there's no `/`. Used for the
 * dashboard "by queue" grouping where SQS-style URLs would otherwise
 * collide visually.
 */
export function extractQueueName(queueUri: string): string {
	const parts = queueUri.split("/");
	return parts[parts.length - 1] || queueUri;
}

/**
 * Zeroed stats row for a queue we've just learned about. All success
 * rates default to 1.0 so a queue with no traffic doesn't look failed.
 */
export function createEmptyQueueStats(name: string): QueueStats {
	return {
		name,
		totalMessages: 0,
		totalConsumed: 0,
		totalFailed: 0,
		successRate: 1.0,
		currentSize: 0,
		throughput: 0,
		pendingMessages: 0,
		messagesNotVisible: 0,
		totalMessages5min: 0,
		totalConsumed5min: 0,
		totalFailed5min: 0,
		successRate5min: 1.0,
		totalMessages30min: 0,
		totalConsumed30min: 0,
		totalFailed30min: 0,
		successRate30min: 1.0,
		totalDeferred: 0,
	};
}

/**
 * Recalculate success rates based on **completed** messages only.
 * Uses consumed / (consumed + failed) so in-flight messages don't drag
 * the rate down.
 */
export function recalculateSuccessRates(stat: QueueStats): void {
	const completed = stat.totalConsumed + stat.totalFailed;
	stat.successRate = completed > 0 ? stat.totalConsumed / completed : 1.0;

	const completed5min = stat.totalConsumed5min + stat.totalFailed5min;
	stat.successRate5min =
		completed5min > 0 ? stat.totalConsumed5min / completed5min : 1.0;

	const completed30min = stat.totalConsumed30min + stat.totalFailed30min;
	stat.successRate30min =
		completed30min > 0 ? stat.totalConsumed30min / completed30min : 1.0;
}
