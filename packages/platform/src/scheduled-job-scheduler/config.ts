/**
 * Scheduled-Job Scheduler Configuration
 *
 * Two cooperating background tasks share this config:
 *   - Poller     — scans ACTIVE jobs and creates instance rows for due slots.
 *   - Dispatcher — drains QUEUED instances and POSTs the webhook envelope.
 */

/** Minimal logger interface compatible with pino and FastifyBaseLogger. */
export interface ScheduledJobSchedulerLogger {
	info(obj: unknown, msg?: string): void;
	warn(obj: unknown, msg?: string): void;
	error(obj: unknown, msg?: string): void;
	debug(obj: unknown, msg?: string): void;
}

export interface ScheduledJobSchedulerConfig {
	/** How often the poller wakes up. Default 30s. */
	readonly pollIntervalMs: number;
	/** How often the dispatcher drains QUEUED instances. Default 5s. */
	readonly dispatchIntervalMs: number;
	/** Max instances dispatched per dispatcher tick. Default 32. */
	readonly dispatchBatchSize: number;
	/** HTTP request timeout for webhook delivery. Default 10s. */
	readonly httpTimeoutMs: number;
}

export const DEFAULT_SCHEDULED_JOB_SCHEDULER_CONFIG: ScheduledJobSchedulerConfig =
	{
		pollIntervalMs: 30_000,
		dispatchIntervalMs: 5_000,
		dispatchBatchSize: 32,
		httpTimeoutMs: 10_000,
	};
