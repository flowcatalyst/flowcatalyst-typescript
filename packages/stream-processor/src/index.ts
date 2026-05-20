/**
 * FlowCatalyst Stream Processor
 *
 * PostgreSQL-based linear projection services for CQRS read models.
 *
 * Runs two independent polling loops:
 *   - Event projection: msg_event_projection_feed -> msg_events_read
 *   - Dispatch job projection: msg_dispatch_job_projection_feed -> msg_dispatch_jobs_read
 *
 * Drop-in replacement for the Java flowcatalyst-stream-processor module.
 */

import postgres from "postgres";
import { createLogger, setDefaultLogger } from "@flowcatalyst/logging";
import { env } from "./env.js";
import { createEventProjectionService } from "./event-projection-service.js";
import { createDispatchJobProjectionService } from "./dispatch-job-projection-service.js";
import { createPartitionManagerService } from "./partition-manager.js";
import { createEventFanOutService } from "./event-fan-out-service.js";
import {
	aggregateHealth,
	type StreamProcessorHealth,
} from "./stream-health.js";

export {
	StreamHealth,
	aggregateHealth,
	type StreamHealthSnapshot,
	type StreamProcessorHealth,
	type StreamStatus,
} from "./stream-health.js";

/**
 * Stream processor configuration options for in-process embedding.
 */
export interface StreamProcessorConfig {
	databaseUrl?: string;
	logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
	/**
	 * Optional pre-existing postgres-js client. When provided, the stream
	 * processor uses this client (and won't close it on stop) instead of
	 * creating its own pool. Used by the in-process app to share a single
	 * connection pool across services — critical for the embedded pglite
	 * dev path where pglite-socket serves one connection at a time.
	 */
	sql?: postgres.Sql;
}

/**
 * Handle returned from startStreamProcessor for lifecycle management.
 */
export interface StreamProcessorHandle {
	stop: () => Promise<void>;
	/**
	 * Aggregated health across all running services (event projection,
	 * dispatch-job projection, partition manager, fan-out). The stream
	 * processor runs in its own process with no HTTP server today;
	 * embedders can serve this snapshot themselves if they want to
	 * expose it.
	 */
	getHealth: () => StreamProcessorHealth;
}

/**
 * Start the FlowCatalyst Stream Processor.
 *
 * @param config - Optional overrides for database URL, log level
 * @returns Handle with stop() method for graceful shutdown
 */
export async function startStreamProcessor(
	config?: StreamProcessorConfig,
): Promise<StreamProcessorHandle> {
	const DATABASE_URL = config?.databaseUrl ?? env.DATABASE_URL;
	const LOG_LEVEL = config?.logLevel ?? env.LOG_LEVEL;

	// Initialize logger
	const logger = createLogger({
		level: LOG_LEVEL,
		serviceName: "stream-processor",
		pretty: env.NODE_ENV === "development",
	});
	setDefaultLogger(logger);

	// Use a caller-provided client if given (in-process app shares its pool
	// to avoid contention on pglite-socket's single-connection limit);
	// otherwise create our own. `ownsSql` tracks whether stop() should close
	// the client.
	const ownsSql = config?.sql == null;
	const poolMax = Number(process.env["DB_POOL_MAX"] ?? "4") || 4;
	const sql =
		config?.sql ??
		postgres(DATABASE_URL, {
			max: poolMax,
			idle_timeout: 20,
			connect_timeout: 30,
		});

	// Create projection services
	const eventProjection = createEventProjectionService(
		sql,
		{
			enabled: env.STREAM_PROCESSOR_EVENTS_ENABLED,
			batchSize: env.STREAM_PROCESSOR_EVENTS_BATCH_SIZE,
		},
		logger.child({ service: "event-projection" }),
	);

	const dispatchJobProjection = createDispatchJobProjectionService(
		sql,
		{
			enabled: env.STREAM_PROCESSOR_DISPATCH_JOBS_ENABLED,
			batchSize: env.STREAM_PROCESSOR_DISPATCH_JOBS_BATCH_SIZE,
		},
		logger.child({ service: "dispatch-job-projection" }),
	);

	const partitionManager = createPartitionManagerService(
		sql,
		{
			enabled: env.STREAM_PROCESSOR_PARTITION_MANAGER_ENABLED,
			monthsForward: env.STREAM_PROCESSOR_PARTITION_MONTHS_FORWARD,
			retentionDays: env.STREAM_PROCESSOR_PARTITION_RETENTION_DAYS,
			tickIntervalMs: 24 * 60 * 60 * 1000,
		},
		logger.child({ service: "partition-manager" }),
	);

	const fanOutService = createEventFanOutService(
		sql,
		{
			enabled: env.STREAM_PROCESSOR_FAN_OUT_ENABLED,
			batchSize: env.STREAM_PROCESSOR_FAN_OUT_BATCH_SIZE,
			subscriptionRefreshMs: env.STREAM_PROCESSOR_FAN_OUT_SUBSCRIPTION_REFRESH_MS,
		},
		logger.child({ service: "event-fan-out" }),
	);

	// Start services
	if (env.STREAM_PROCESSOR_EVENTS_ENABLED) {
		eventProjection.start();
	} else {
		logger.info("Event projection service disabled");
	}

	if (env.STREAM_PROCESSOR_DISPATCH_JOBS_ENABLED) {
		dispatchJobProjection.start();
	} else {
		logger.info("Dispatch job projection service disabled");
	}

	if (env.STREAM_PROCESSOR_PARTITION_MANAGER_ENABLED) {
		partitionManager.start();
	} else {
		logger.info("Partition manager disabled");
	}

	if (env.STREAM_PROCESSOR_FAN_OUT_ENABLED) {
		fanOutService.start();
	} else {
		logger.info(
			"Event fan-out service disabled (in-UoW fan-out is the active path)",
		);
	}

	logger.info(
		{
			eventsEnabled: env.STREAM_PROCESSOR_EVENTS_ENABLED,
			eventsBatchSize: env.STREAM_PROCESSOR_EVENTS_BATCH_SIZE,
			dispatchJobsEnabled: env.STREAM_PROCESSOR_DISPATCH_JOBS_ENABLED,
			dispatchJobsBatchSize: env.STREAM_PROCESSOR_DISPATCH_JOBS_BATCH_SIZE,
			partitionManagerEnabled: env.STREAM_PROCESSOR_PARTITION_MANAGER_ENABLED,
			fanOutEnabled: env.STREAM_PROCESSOR_FAN_OUT_ENABLED,
		},
		"Stream processor started",
	);

	return {
		stop: async () => {
			logger.info("Shutting down stream processor...");
			eventProjection.stop();
			dispatchJobProjection.stop();
			partitionManager.stop();
			fanOutService.stop();
			// Only close the pool if we own it. When the caller shared
			// their client, leaving it open avoids tearing down their
			// connections during our shutdown.
			if (ownsSql) {
				// sql.end({ timeout }) waits for in-flight queries to drain
				// and then closes the connection pool. Bound it so a slow/
				// blocked query (e.g. partition manager mid-init) can't
				// stall shutdown.
				await sql.end({ timeout: 1 });
			}
			logger.info("Stream processor stopped");
		},
		getHealth: () =>
			aggregateHealth([
				eventProjection.health,
				dispatchJobProjection.health,
				partitionManager.health,
				fanOutService.health,
			]),
	};
}

// Run when executed as main module
const isMainModule =
	typeof process !== "undefined" &&
	process.argv[1] &&
	(process.argv[1].endsWith("/index.ts") ||
		process.argv[1].endsWith("/index.js"));

if (isMainModule) {
	void (async () => {
		const handle = await startStreamProcessor();

		// Graceful shutdown
		const shutdown = async () => {
			await handle.stop();
			process.exit(0);
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	})();
}
