/**
 * ScheduledJob Entity
 *
 * A ScheduledJob is a definition: cron expression(s), routing code, optional
 * payload. Each cron tick produces a ScheduledJobInstance (history row).
 *
 * The instance/log entities live alongside this file. They are platform
 * infrastructure plumbing, not aggregates — they bypass the UnitOfWork.
 */

import { generate } from "@flowcatalyst/tsid";
import type { ScheduledJobStatus } from "./scheduled-job-status.js";
import type { TriggerKind } from "./trigger-kind.js";
import type { InstanceStatus } from "./instance-status.js";
import type { CompletionStatus } from "./completion-status.js";
import type { LogLevel } from "./log-level.js";

/**
 * ScheduledJob aggregate. Immutable record; updates produce new instances.
 */
export interface ScheduledJob {
	readonly id: string;
	/** NULL = platform-scoped; set = client-scoped. */
	readonly clientId: string | null;
	/** Routing key the SDK uses to find the registered handler. Unique per (clientId, code). */
	readonly code: string;
	readonly name: string;
	readonly description: string | null;
	readonly status: ScheduledJobStatus;
	/** One or more cron expressions. Fire times are unioned (latest slot wins). */
	readonly crons: readonly string[];
	/** IANA timezone (e.g. "UTC", "Europe/London"). */
	readonly timezone: string;
	/** Optional user-defined payload passed through verbatim in the webhook envelope. */
	readonly payload: unknown | null;
	/** Informational only — platform does not enforce; SDK is responsible. */
	readonly concurrent: boolean;
	/** When true, SDK is expected to call back on completion; DELIVERED is not terminal. */
	readonly tracksCompletion: boolean;
	/** Hint passed to the SDK for its own runtime timeout. Not enforced. */
	readonly timeoutSeconds: number | null;
	/** How many times the platform retries delivery (HTTP 202 ACK) before DELIVERY_FAILED. */
	readonly deliveryMaxAttempts: number;
	/** HTTP endpoint the dispatcher POSTs to on every fire. */
	readonly targetUrl: string | null;
	/** Last cron-slot timestamp the poller fired for this job. */
	readonly lastFiredAt: Date | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly createdBy: string | null;
	readonly updatedBy: string | null;
	readonly version: number;
}

export type NewScheduledJob = Omit<ScheduledJob, "createdAt" | "updatedAt"> & {
	createdAt?: Date;
	updatedAt?: Date;
};

export interface CreateScheduledJobInput {
	code: string;
	name: string;
	crons: readonly string[];
	clientId?: string | null;
	description?: string | null;
	timezone?: string;
	payload?: unknown | null;
	concurrent?: boolean;
	tracksCompletion?: boolean;
	timeoutSeconds?: number | null;
	deliveryMaxAttempts?: number;
	targetUrl?: string | null;
	createdBy?: string | null;
}

/**
 * Construct a new ACTIVE ScheduledJob. Cron syntax validation is the caller's
 * responsibility (use-case layer).
 */
export function createScheduledJob(input: CreateScheduledJobInput): NewScheduledJob {
	const now = new Date();
	return {
		id: generate("SCHEDULED_JOB"),
		clientId: input.clientId ?? null,
		code: input.code,
		name: input.name,
		description: input.description ?? null,
		status: "ACTIVE",
		crons: input.crons,
		timezone: input.timezone ?? "UTC",
		payload: input.payload ?? null,
		concurrent: input.concurrent ?? false,
		tracksCompletion: input.tracksCompletion ?? false,
		timeoutSeconds: input.timeoutSeconds ?? null,
		deliveryMaxAttempts: input.deliveryMaxAttempts ?? 3,
		targetUrl: input.targetUrl ?? null,
		lastFiredAt: null,
		createdBy: input.createdBy ?? null,
		updatedBy: null,
		version: 1,
		createdAt: now,
		updatedAt: now,
	};
}

export interface UpdateScheduledJobInput {
	name?: string | undefined;
	description?: string | null | undefined;
	crons?: readonly string[] | undefined;
	timezone?: string | undefined;
	payload?: unknown | null | undefined;
	concurrent?: boolean | undefined;
	tracksCompletion?: boolean | undefined;
	timeoutSeconds?: number | null | undefined;
	deliveryMaxAttempts?: number | undefined;
	targetUrl?: string | null | undefined;
	updatedBy?: string | null | undefined;
}

export function updateScheduledJob(
	job: ScheduledJob,
	updates: UpdateScheduledJobInput,
): ScheduledJob {
	return {
		...job,
		name: updates.name ?? job.name,
		description: updates.description !== undefined ? updates.description : job.description,
		crons: updates.crons ?? job.crons,
		timezone: updates.timezone ?? job.timezone,
		payload: updates.payload !== undefined ? updates.payload : job.payload,
		concurrent: updates.concurrent ?? job.concurrent,
		tracksCompletion: updates.tracksCompletion ?? job.tracksCompletion,
		timeoutSeconds:
			updates.timeoutSeconds !== undefined
				? updates.timeoutSeconds
				: job.timeoutSeconds,
		deliveryMaxAttempts: updates.deliveryMaxAttempts ?? job.deliveryMaxAttempts,
		targetUrl: updates.targetUrl !== undefined ? updates.targetUrl : job.targetUrl,
		updatedBy: updates.updatedBy ?? job.updatedBy,
		updatedAt: new Date(),
		version: job.version + 1,
	};
}

export function pauseScheduledJob(job: ScheduledJob): ScheduledJob {
	return { ...job, status: "PAUSED", updatedAt: new Date(), version: job.version + 1 };
}

export function resumeScheduledJob(job: ScheduledJob): ScheduledJob {
	return { ...job, status: "ACTIVE", updatedAt: new Date(), version: job.version + 1 };
}

export function archiveScheduledJob(job: ScheduledJob): ScheduledJob {
	return {
		...job,
		status: "ARCHIVED",
		updatedAt: new Date(),
		version: job.version + 1,
	};
}

export function isScheduledJobActive(job: ScheduledJob): boolean {
	return job.status === "ACTIVE";
}

/**
 * Per-firing history row. Not an aggregate — written directly by the
 * scheduler/dispatcher via the infrastructure path.
 */
export interface ScheduledJobInstance {
	readonly id: string;
	readonly scheduledJobId: string;
	readonly clientId: string | null;
	readonly jobCode: string;
	readonly triggerKind: TriggerKind;
	/** Cron slot this firing represents. NULL for MANUAL. */
	readonly scheduledFor: Date | null;
	readonly firedAt: Date;
	readonly deliveredAt: Date | null;
	readonly completedAt: Date | null;
	readonly status: InstanceStatus;
	readonly deliveryAttempts: number;
	readonly deliveryError: string | null;
	readonly completionStatus: CompletionStatus | null;
	readonly completionResult: unknown | null;
	readonly correlationId: string | null;
	readonly createdAt: Date;
}

export interface ScheduledJobInstanceLog {
	readonly id: string;
	readonly instanceId: string;
	readonly scheduledJobId: string | null;
	readonly clientId: string | null;
	readonly level: LogLevel;
	readonly message: string;
	readonly metadata: unknown | null;
	readonly createdAt: Date;
}
