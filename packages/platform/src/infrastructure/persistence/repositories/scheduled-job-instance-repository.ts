/**
 * ScheduledJobInstance + InstanceLog Repository
 *
 * **Bypasses UnitOfWork by design.** Instances are created on every cron tick
 * and lifecycle-transitioned during webhook delivery — wrapping these in UoW
 * would emit a domain event per firing and saturate the event log. This is
 * the same exemption that applies to dispatch-job delivery lifecycle and the
 * outbox processor.
 *
 * The underlying tables (`msg_scheduled_job_instances`,
 * `msg_scheduled_job_instance_logs`) are RANGE-partitioned by `created_at` in
 * production. All writes carry `created_at` as a partition-routing key so
 * partition pruning applies on every UPDATE.
 *
 * Uses the raw postgres.js client (not Drizzle) to mirror the Rust
 * infrastructure path and avoid relational-query overhead on hot paths.
 */

import type postgres from "postgres";
import { generate } from "@flowcatalyst/tsid";
import {
	type ScheduledJobInstance,
	type ScheduledJobInstanceLog,
	type InstanceStatus,
	type TriggerKind,
	type CompletionStatus,
	type LogLevel,
	parseInstanceStatus,
	parseTriggerKind,
	parseCompletionStatus,
	parseLogLevel,
} from "../../../domain/index.js";

interface InstanceRow {
	id: string;
	scheduled_job_id: string;
	client_id: string | null;
	job_code: string;
	trigger_kind: string;
	scheduled_for: Date | null;
	fired_at: Date;
	delivered_at: Date | null;
	completed_at: Date | null;
	status: string;
	delivery_attempts: number;
	delivery_error: string | null;
	completion_status: string | null;
	completion_result: unknown | null;
	correlation_id: string | null;
	created_at: Date;
}

interface LogRow {
	id: string;
	instance_id: string;
	scheduled_job_id: string | null;
	client_id: string | null;
	level: string;
	message: string;
	metadata: unknown | null;
	created_at: Date;
}

function rowToInstance(r: InstanceRow): ScheduledJobInstance {
	return {
		id: r.id,
		scheduledJobId: r.scheduled_job_id,
		clientId: r.client_id,
		jobCode: r.job_code,
		triggerKind: parseTriggerKind(r.trigger_kind),
		scheduledFor: r.scheduled_for,
		firedAt: r.fired_at,
		deliveredAt: r.delivered_at,
		completedAt: r.completed_at,
		status: parseInstanceStatus(r.status),
		deliveryAttempts: r.delivery_attempts,
		deliveryError: r.delivery_error,
		completionStatus: parseCompletionStatus(r.completion_status),
		completionResult: r.completion_result,
		correlationId: r.correlation_id,
		createdAt: r.created_at,
	};
}

function rowToLog(r: LogRow): ScheduledJobInstanceLog {
	return {
		id: r.id,
		instanceId: r.instance_id,
		scheduledJobId: r.scheduled_job_id,
		clientId: r.client_id,
		level: parseLogLevel(r.level),
		message: r.message,
		metadata: r.metadata,
		createdAt: r.created_at,
	};
}

export interface InstanceListFilters {
	readonly scheduledJobId?: string | undefined;
	readonly clientId?: string | undefined;
	readonly status?: InstanceStatus | undefined;
	readonly triggerKind?: TriggerKind | undefined;
	readonly from?: Date | undefined;
	readonly to?: Date | undefined;
	readonly limit?: number | undefined;
	readonly offset?: number | undefined;
}

export interface NewInstance {
	scheduledJobId: string;
	clientId: string | null;
	jobCode: string;
	triggerKind: TriggerKind;
	scheduledFor: Date | null;
	firedAt: Date;
	correlationId?: string | null;
}

export interface NewInstanceLog {
	instanceId: string;
	scheduledJobId?: string | null;
	clientId?: string | null;
	level?: LogLevel;
	message: string;
	metadata?: unknown | null;
}

export interface ScheduledJobInstanceRepository {
	// Writes (infrastructure path; bypass UoW).
	insert(input: NewInstance): Promise<ScheduledJobInstance>;
	markInFlight(id: string, createdAt: Date): Promise<void>;
	markDelivered(id: string, createdAt: Date): Promise<void>;
	markDeliveryFailed(
		id: string,
		createdAt: Date,
		error: string,
		terminal: boolean,
	): Promise<void>;
	recordCompletion(
		id: string,
		createdAt: Date,
		status: CompletionStatus,
		result: unknown | null,
	): Promise<void>;

	// Reads.
	findById(id: string): Promise<ScheduledJobInstance | undefined>;
	hasActiveInstance(scheduledJobId: string): Promise<boolean>;
	list(filters: InstanceListFilters): Promise<ScheduledJobInstance[]>;
	count(filters: Omit<InstanceListFilters, "limit" | "offset">): Promise<number>;

	// Logs.
	insertLog(input: NewInstanceLog): Promise<ScheduledJobInstanceLog>;
	listLogsForInstance(
		instanceId: string,
		limit?: number,
	): Promise<ScheduledJobInstanceLog[]>;
}

export function createScheduledJobInstanceRepository(
	sql: postgres.Sql,
): ScheduledJobInstanceRepository {
	return {
		async insert(input: NewInstance): Promise<ScheduledJobInstance> {
			const id = generate("SCHEDULED_JOB_INSTANCE");
			const createdAt = input.firedAt;
			await sql`
				INSERT INTO msg_scheduled_job_instances (
					id, scheduled_job_id, client_id, job_code, trigger_kind,
					scheduled_for, fired_at, status, delivery_attempts,
					correlation_id, created_at
				) VALUES (
					${id}, ${input.scheduledJobId}, ${input.clientId}, ${input.jobCode},
					${input.triggerKind}, ${input.scheduledFor}, ${input.firedAt},
					'QUEUED', 0, ${input.correlationId ?? null}, ${createdAt}
				)
			`;
			return {
				id,
				scheduledJobId: input.scheduledJobId,
				clientId: input.clientId,
				jobCode: input.jobCode,
				triggerKind: input.triggerKind,
				scheduledFor: input.scheduledFor,
				firedAt: input.firedAt,
				deliveredAt: null,
				completedAt: null,
				status: "QUEUED",
				deliveryAttempts: 0,
				deliveryError: null,
				completionStatus: null,
				completionResult: null,
				correlationId: input.correlationId ?? null,
				createdAt,
			};
		},

		async markInFlight(id: string, createdAt: Date): Promise<void> {
			await sql`
				UPDATE msg_scheduled_job_instances
				SET status = 'IN_FLIGHT',
				    delivery_attempts = delivery_attempts + 1
				WHERE id = ${id} AND created_at = ${createdAt}
			`;
		},

		async markDelivered(id: string, createdAt: Date): Promise<void> {
			await sql`
				UPDATE msg_scheduled_job_instances
				SET status = 'DELIVERED', delivered_at = NOW()
				WHERE id = ${id} AND created_at = ${createdAt}
			`;
		},

		async markDeliveryFailed(
			id: string,
			createdAt: Date,
			error: string,
			terminal: boolean,
		): Promise<void> {
			const status = terminal ? "DELIVERY_FAILED" : "QUEUED";
			await sql`
				UPDATE msg_scheduled_job_instances
				SET status = ${status}, delivery_error = ${error}
				WHERE id = ${id} AND created_at = ${createdAt}
			`;
		},

		async recordCompletion(
			id: string,
			createdAt: Date,
			status: CompletionStatus,
			result: unknown | null,
		): Promise<void> {
			const newStatus: InstanceStatus =
				status === "SUCCESS" ? "COMPLETED" : "FAILED";
			await sql`
				UPDATE msg_scheduled_job_instances
				SET status = ${newStatus},
				    completion_status = ${status},
				    completion_result = ${result as never},
				    completed_at = NOW()
				WHERE id = ${id} AND created_at = ${createdAt}
			`;
		},

		async findById(
			id: string,
		): Promise<ScheduledJobInstance | undefined> {
			const rows = await sql<InstanceRow[]>`
				SELECT id, scheduled_job_id, client_id, job_code, trigger_kind,
				       scheduled_for, fired_at, delivered_at, completed_at, status,
				       delivery_attempts, delivery_error, completion_status,
				       completion_result, correlation_id, created_at
				FROM msg_scheduled_job_instances
				WHERE id = ${id}
				LIMIT 1
			`;
			return rows[0] ? rowToInstance(rows[0]) : undefined;
		},

		async hasActiveInstance(scheduledJobId: string): Promise<boolean> {
			const rows = await sql<{ c: string }[]>`
				SELECT COUNT(*)::text AS c
				FROM msg_scheduled_job_instances
				WHERE scheduled_job_id = ${scheduledJobId}
				  AND status IN ('QUEUED', 'IN_FLIGHT', 'DELIVERED')
			`;
			return Number(rows[0]?.c ?? 0) > 0;
		},

		async list(filters: InstanceListFilters): Promise<ScheduledJobInstance[]> {
			let rows = await sql<InstanceRow[]>`
				SELECT id, scheduled_job_id, client_id, job_code, trigger_kind,
				       scheduled_for, fired_at, delivered_at, completed_at, status,
				       delivery_attempts, delivery_error, completion_status,
				       completion_result, correlation_id, created_at
				FROM msg_scheduled_job_instances
				WHERE
					${filters.scheduledJobId !== undefined ? sql`scheduled_job_id = ${filters.scheduledJobId}` : sql`TRUE`}
					AND ${filters.clientId !== undefined ? sql`client_id = ${filters.clientId}` : sql`TRUE`}
					AND ${filters.status !== undefined ? sql`status = ${filters.status}` : sql`TRUE`}
					AND ${filters.triggerKind !== undefined ? sql`trigger_kind = ${filters.triggerKind}` : sql`TRUE`}
					AND ${filters.from !== undefined ? sql`created_at >= ${filters.from}` : sql`TRUE`}
					AND ${filters.to !== undefined ? sql`created_at < ${filters.to}` : sql`TRUE`}
				ORDER BY created_at DESC
				${filters.limit !== undefined ? sql`LIMIT ${filters.limit}` : sql``}
				${filters.offset !== undefined ? sql`OFFSET ${filters.offset}` : sql``}
			`;
			return rows.map(rowToInstance);
		},

		async count(
			filters: Omit<InstanceListFilters, "limit" | "offset">,
		): Promise<number> {
			const rows = await sql<{ c: string }[]>`
				SELECT COUNT(*)::text AS c
				FROM msg_scheduled_job_instances
				WHERE
					${filters.scheduledJobId !== undefined ? sql`scheduled_job_id = ${filters.scheduledJobId}` : sql`TRUE`}
					AND ${filters.clientId !== undefined ? sql`client_id = ${filters.clientId}` : sql`TRUE`}
					AND ${filters.status !== undefined ? sql`status = ${filters.status}` : sql`TRUE`}
					AND ${filters.triggerKind !== undefined ? sql`trigger_kind = ${filters.triggerKind}` : sql`TRUE`}
					AND ${filters.from !== undefined ? sql`created_at >= ${filters.from}` : sql`TRUE`}
					AND ${filters.to !== undefined ? sql`created_at < ${filters.to}` : sql`TRUE`}
			`;
			return Number(rows[0]?.c ?? 0);
		},

		async insertLog(input: NewInstanceLog): Promise<ScheduledJobInstanceLog> {
			const id = generate("SCHEDULED_JOB_INSTANCE_LOG");
			const now = new Date();
			const level: LogLevel = input.level ?? "INFO";
			await sql`
				INSERT INTO msg_scheduled_job_instance_logs (
					id, instance_id, scheduled_job_id, client_id, level,
					message, metadata, created_at
				) VALUES (
					${id}, ${input.instanceId}, ${input.scheduledJobId ?? null},
					${input.clientId ?? null}, ${level}, ${input.message},
					${(input.metadata ?? null) as never}, ${now}
				)
			`;
			return {
				id,
				instanceId: input.instanceId,
				scheduledJobId: input.scheduledJobId ?? null,
				clientId: input.clientId ?? null,
				level,
				message: input.message,
				metadata: input.metadata ?? null,
				createdAt: now,
			};
		},

		async listLogsForInstance(
			instanceId: string,
			limit?: number,
		): Promise<ScheduledJobInstanceLog[]> {
			const lim = limit ?? 500;
			const rows = await sql<LogRow[]>`
				SELECT id, instance_id, scheduled_job_id, client_id, level,
				       message, metadata, created_at
				FROM msg_scheduled_job_instance_logs
				WHERE instance_id = ${instanceId}
				ORDER BY created_at ASC
				LIMIT ${lim}
			`;
			return rows.map(rowToLog);
		},
	};
}
