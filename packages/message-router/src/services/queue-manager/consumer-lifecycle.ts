import type { Logger } from "@flowcatalyst/logging";
import type { MessageBatch } from "@flowcatalyst/contracts";
import type {
	MessageCallbackFns,
	QueueConsumer,
} from "@flowcatalyst/queue-core";
import type { WarningService } from "../warning-service.js";

export interface ConsumerLifecycleDeps {
	readonly logger: Logger;
	readonly warnings: WarningService;
	readonly consumers: Map<string, QueueConsumer>;
	readonly drainingConsumers: Map<string, QueueConsumer>;
	handleBatch(
		batch: MessageBatch,
		callbacks: Map<string, MessageCallbackFns>,
	): Promise<void>;
}

/**
 * Pause every consumer (stop polling, but keep them around so resume
 * can restart polling without re-instantiating). Used when the traffic
 * manager transitions to STANDBY.
 *
 * Fire-and-forget: the Promise.allSettled completion log fires async,
 * matching prior behaviour where the caller didn't await it.
 */
export function pauseAllConsumers(deps: ConsumerLifecycleDeps): void {
	const { logger, consumers } = deps;
	logger.info("Pausing all consumers for standby mode");

	const failedQueueIds: string[] = [];
	const pausePromises = [...consumers.entries()].map(
		async ([queueId, consumer]) => {
			try {
				await consumer.stop();
			} catch (err) {
				logger.warn({ err, queueId }, "Failed to pause consumer");
				failedQueueIds.push(queueId);
			}
		},
	);
	Promise.allSettled(pausePromises).then(() => {
		if (failedQueueIds.length > 0) {
			logger.warn(
				{ failedCount: failedQueueIds.length, queueIds: failedQueueIds },
				"Some consumers failed to pause for standby",
			);
		}
	});
}

/**
 * Resume every consumer. Used when the traffic manager transitions
 * from STANDBY back to PRIMARY.
 */
export function resumeAllConsumers(deps: ConsumerLifecycleDeps): void {
	const { logger, consumers } = deps;
	logger.info("Resuming all consumers from standby mode");

	for (const consumer of consumers.values()) {
		consumer.start().catch((err) => {
			logger.error({ err }, "Error starting consumer");
		});
	}
}

/**
 * Check every consumer's health; for any unhealthy one, stop it, move
 * to draining, and recreate via the consumer's `recreate()` hook.
 *
 * This is the 60s health-monitor tick. Matches Java
 * `QueueManager.monitorAndRestartUnhealthyConsumers`.
 */
export async function monitorAndRestartUnhealthyConsumers(
	deps: ConsumerLifecycleDeps,
): Promise<void> {
	const { logger, warnings, consumers } = deps;

	// Auto-cleanup warnings older than 8 hours (matching Java)
	warnings.clearOlderThan(8);

	logger.info({ consumerCount: consumers.size }, "Health check running");

	for (const [queueId, consumer] of consumers) {
		const health = consumer.getHealth();
		logger.debug({ queueId, ...health }, "Consumer health check");

		if (!health.isHealthy) {
			await restartConsumer(deps, queueId, consumer);
		}
	}
}

async function restartConsumer(
	deps: ConsumerLifecycleDeps,
	queueId: string,
	consumer: QueueConsumer,
): Promise<void> {
	const { logger, warnings, consumers, drainingConsumers, handleBatch } = deps;
	const health = consumer.getHealth();
	logger.warn(
		{ queueId, timeSinceLastPollMs: health.timeSinceLastPollMs },
		"Consumer unhealthy - initiating restart",
	);
	warnings.add(
		"CONSUMER_RESTART",
		"WARNING",
		`Consumer for queue [${queueId}] was unhealthy (last poll ${health.timeSinceLastPollSeconds}s ago) and has been restarted`,
		"QueueManager",
	);

	try {
		await consumer.stop();
		consumers.delete(queueId);
		drainingConsumers.set(queueId, consumer);

		const newConsumer = consumer.recreate((batch, cbs) => handleBatch(batch, cbs));
		await newConsumer.start();
		consumers.set(queueId, newConsumer);

		logger.info({ queueId }, "Successfully restarted consumer");
	} catch (error) {
		logger.error({ err: error, queueId }, "Failed to restart consumer");
		warnings.add(
			"CONSUMER_RESTART_FAILED",
			"CRITICAL",
			`Failed to restart consumer for queue [${queueId}]: ${error}`,
			"QueueManager",
		);
	}
}
