/**
 * Scheduled Job Domain
 *
 * Cron-triggered webhook jobs. Definitions are aggregates; per-firing
 * instances + their logs are platform infrastructure plumbing.
 */

export {
	type ScheduledJob,
	type NewScheduledJob,
	type CreateScheduledJobInput,
	type UpdateScheduledJobInput,
	type ScheduledJobInstance,
	type ScheduledJobInstanceLog,
	createScheduledJob,
	updateScheduledJob,
	pauseScheduledJob,
	resumeScheduledJob,
	archiveScheduledJob,
	isScheduledJobActive,
} from "./scheduled-job.js";

export {
	type ScheduledJobStatus,
	ScheduledJobStatus as ScheduledJobStatusEnum,
	parseScheduledJobStatus,
} from "./scheduled-job-status.js";

export {
	type TriggerKind,
	TriggerKind as TriggerKindEnum,
	parseTriggerKind,
} from "./trigger-kind.js";

export {
	type InstanceStatus,
	InstanceStatus as InstanceStatusEnum,
	parseInstanceStatus,
	isTerminalStatus,
} from "./instance-status.js";

export {
	type CompletionStatus,
	CompletionStatus as CompletionStatusEnum,
	parseCompletionStatus,
} from "./completion-status.js";

export {
	type LogLevel,
	LogLevel as LogLevelEnum,
	parseLogLevel,
} from "./log-level.js";

export {
	type ScheduledJobCreatedData,
	ScheduledJobCreated,
	type ScheduledJobUpdatedData,
	ScheduledJobUpdated,
	type ScheduledJobPausedData,
	ScheduledJobPaused,
	type ScheduledJobResumedData,
	ScheduledJobResumed,
	type ScheduledJobArchivedData,
	ScheduledJobArchived,
	type ScheduledJobDeletedData,
	ScheduledJobDeleted,
	type ScheduledJobFiredData,
	ScheduledJobFired,
	type ScheduledJobsSyncedData,
	ScheduledJobsSynced,
} from "./events.js";
