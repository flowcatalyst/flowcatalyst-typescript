/**
 * Scheduled Jobs API client.
 *
 * All routes hit the platform's `/api/scheduled-jobs/*` surface — there's no
 * BFF for scheduled jobs in the TS platform yet (the Rust frontend split reads
 * to a BFF; the TS port skips that).
 */

import { apiFetch } from "./client";

export type ScheduledJobStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";
export type TriggerKind = "CRON" | "MANUAL";
export type InstanceStatus =
	| "QUEUED"
	| "IN_FLIGHT"
	| "DELIVERED"
	| "COMPLETED"
	| "FAILED"
	| "DELIVERY_FAILED";
export type CompletionStatus = "SUCCESS" | "FAILURE";
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface ScheduledJob {
	id: string;
	clientId?: string | null;
	code: string;
	name: string;
	description?: string | null;
	status: ScheduledJobStatus;
	crons: string[];
	timezone: string;
	payload?: unknown;
	concurrent: boolean;
	tracksCompletion: boolean;
	timeoutSeconds?: number | null;
	deliveryMaxAttempts: number;
	targetUrl?: string | null;
	lastFiredAt?: string | null;
	createdAt: string;
	updatedAt: string;
	version: number;
	hasActiveInstance?: boolean;
}

export interface ScheduledJobInstance {
	id: string;
	scheduledJobId: string;
	jobCode: string;
	clientId?: string | null;
	triggerKind: TriggerKind;
	scheduledFor?: string | null;
	firedAt: string;
	deliveredAt?: string | null;
	completedAt?: string | null;
	status: InstanceStatus;
	deliveryAttempts: number;
	deliveryError?: string | null;
	completionStatus?: CompletionStatus | null;
	completionResult?: unknown;
	correlationId?: string | null;
	createdAt: string;
}

export interface ScheduledJobInstanceLog {
	id: string;
	instanceId: string;
	scheduledJobId?: string | null;
	clientId?: string | null;
	level: LogLevel;
	message: string;
	metadata?: unknown;
	createdAt: string;
}

export interface ScheduledJobListResponse {
	scheduledJobs: ScheduledJob[];
	total: number;
}

export interface ScheduledJobInstanceListResponse {
	instances: ScheduledJobInstance[];
	total: number;
}

export interface ScheduledJobInstanceLogsResponse {
	logs: ScheduledJobInstanceLog[];
}

export interface ListJobsParams {
	clientId?: string;
	status?: ScheduledJobStatus | string;
	search?: string;
	limit?: number;
	offset?: number;
}

export interface ListInstancesParams {
	scheduledJobId?: string;
	status?: InstanceStatus | string;
	triggerKind?: TriggerKind | string;
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}

export interface CreateScheduledJobRequest {
	code: string;
	name: string;
	description?: string;
	clientId?: string | null;
	crons: string[];
	timezone?: string;
	payload?: unknown;
	concurrent?: boolean;
	tracksCompletion?: boolean;
	timeoutSeconds?: number;
	deliveryMaxAttempts?: number;
	targetUrl?: string;
}

export interface UpdateScheduledJobRequest {
	name?: string;
	description?: string;
	crons?: string[];
	timezone?: string;
	payload?: unknown;
	concurrent?: boolean;
	tracksCompletion?: boolean;
	timeoutSeconds?: number;
	deliveryMaxAttempts?: number;
	targetUrl?: string;
}

function qs(params: Record<string, unknown>): string {
	const sp = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined || v === null || v === "") continue;
		sp.append(k, String(v));
	}
	const s = sp.toString();
	return s ? `?${s}` : "";
}

export const scheduledJobsApi = {
	list(params: ListJobsParams = {}): Promise<ScheduledJobListResponse> {
		return apiFetch(`/scheduled-jobs${qs(params as Record<string, unknown>)}`);
	},

	get(id: string): Promise<ScheduledJob> {
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}`);
	},

	create(body: CreateScheduledJobRequest): Promise<{ id: string }> {
		return apiFetch(`/scheduled-jobs`, {
			method: "POST",
			body: JSON.stringify(body),
		});
	},

	update(id: string, body: UpdateScheduledJobRequest): Promise<ScheduledJob> {
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}`, {
			method: "PATCH",
			body: JSON.stringify(body),
		});
	},

	pause(id: string): Promise<ScheduledJob> {
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}/pause`, {
			method: "POST",
		});
	},

	resume(id: string): Promise<ScheduledJob> {
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}/resume`, {
			method: "POST",
		});
	},

	archive(id: string): Promise<ScheduledJob> {
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}/archive`, {
			method: "POST",
		});
	},

	delete(id: string): Promise<void> {
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}`, {
			method: "DELETE",
		});
	},

	fire(id: string, correlationId?: string): Promise<{ id: string }> {
		const body = correlationId ? { correlationId } : {};
		return apiFetch(`/scheduled-jobs/${encodeURIComponent(id)}/fire`, {
			method: "POST",
			body: JSON.stringify(body),
		});
	},

	listInstances(
		params: ListInstancesParams = {},
	): Promise<ScheduledJobInstanceListResponse> {
		return apiFetch(
			`/scheduled-jobs/instances${qs(params as Record<string, unknown>)}`,
		);
	},

	getInstance(instanceId: string): Promise<ScheduledJobInstance> {
		return apiFetch(
			`/scheduled-jobs/instances/${encodeURIComponent(instanceId)}`,
		);
	},

	listInstanceLogs(
		instanceId: string,
	): Promise<ScheduledJobInstanceLogsResponse> {
		return apiFetch(
			`/scheduled-jobs/instances/${encodeURIComponent(instanceId)}/logs`,
		);
	},
};
