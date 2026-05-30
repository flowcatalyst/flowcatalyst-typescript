/**
 * Scheduled Jobs Admin API
 *
 * REST endpoints for scheduled-job management plus the SDK callback endpoints
 * (`/instances/:id/log`, `/instances/:id/complete`).
 */

import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type, type Static } from "@sinclair/typebox";
import {
	sendResult,
	jsonCreated,
	jsonSuccess,
	noContent,
	notFound,
	ErrorResponseSchema,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";
import type { UseCase } from "@flowcatalyst/application";

import type {
	CreateScheduledJobCommand,
	UpdateScheduledJobCommand,
	PauseScheduledJobCommand,
	ResumeScheduledJobCommand,
	ArchiveScheduledJobCommand,
	DeleteScheduledJobCommand,
	FireScheduledJobCommand,
	SyncScheduledJobsCommand,
} from "../../application/index.js";
import type {
	ScheduledJobCreated,
	ScheduledJobUpdated,
	ScheduledJobPaused,
	ScheduledJobResumed,
	ScheduledJobArchived,
	ScheduledJobDeleted,
	ScheduledJobFired,
	ScheduledJobsSynced,
	ScheduledJob,
	ScheduledJobInstance,
	ScheduledJobInstanceLog,
	CompletionStatus,
	LogLevel,
} from "../../domain/index.js";
import type {
	ScheduledJobRepository,
	ScheduledJobInstanceRepository,
} from "../../infrastructure/persistence/index.js";
import { requirePermission } from "../../authorization/index.js";
import { SCHEDULED_JOB_PERMISSIONS } from "../../authorization/permissions/platform-admin.js";

// ─── Schemas ────────────────────────────────────────────────────────────────

const StatusEnum = Type.Union([
	Type.Literal("ACTIVE"),
	Type.Literal("PAUSED"),
	Type.Literal("ARCHIVED"),
]);

const TriggerKindEnum = Type.Union([
	Type.Literal("CRON"),
	Type.Literal("MANUAL"),
]);

const InstanceStatusEnum = Type.Union([
	Type.Literal("QUEUED"),
	Type.Literal("IN_FLIGHT"),
	Type.Literal("DELIVERED"),
	Type.Literal("COMPLETED"),
	Type.Literal("FAILED"),
	Type.Literal("DELIVERY_FAILED"),
]);

const LogLevelEnum = Type.Union([
	Type.Literal("DEBUG"),
	Type.Literal("INFO"),
	Type.Literal("WARN"),
	Type.Literal("ERROR"),
]);

const CompletionStatusEnum = Type.Union([
	Type.Literal("SUCCESS"),
	Type.Literal("FAILURE"),
]);

const ScheduledJobResponseSchema = Type.Object({
	id: Type.String(),
	clientId: Type.Union([Type.String(), Type.Null()]),
	code: Type.String(),
	name: Type.String(),
	description: Type.Union([Type.String(), Type.Null()]),
	status: StatusEnum,
	crons: Type.Array(Type.String()),
	timezone: Type.String(),
	payload: Type.Unknown(),
	concurrent: Type.Boolean(),
	tracksCompletion: Type.Boolean(),
	timeoutSeconds: Type.Union([Type.Integer(), Type.Null()]),
	deliveryMaxAttempts: Type.Integer(),
	targetUrl: Type.Union([Type.String(), Type.Null()]),
	lastFiredAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
	createdBy: Type.Union([Type.String(), Type.Null()]),
	updatedBy: Type.Union([Type.String(), Type.Null()]),
	version: Type.Integer(),
});

const CreateScheduledJobSchema = Type.Object({
	clientId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	code: Type.String({ minLength: 1, maxLength: 200 }),
	name: Type.String({ minLength: 1, maxLength: 200 }),
	description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	crons: Type.Array(Type.String(), { minItems: 1 }),
	timezone: Type.Optional(Type.String({ maxLength: 64 })),
	payload: Type.Optional(Type.Unknown()),
	concurrent: Type.Optional(Type.Boolean()),
	tracksCompletion: Type.Optional(Type.Boolean()),
	timeoutSeconds: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	deliveryMaxAttempts: Type.Optional(Type.Integer({ minimum: 1 })),
	targetUrl: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Null()])),
});

const UpdateScheduledJobSchema = Type.Object({
	name: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
	description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	crons: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
	timezone: Type.Optional(Type.String({ maxLength: 64 })),
	payload: Type.Optional(Type.Unknown()),
	concurrent: Type.Optional(Type.Boolean()),
	tracksCompletion: Type.Optional(Type.Boolean()),
	timeoutSeconds: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	deliveryMaxAttempts: Type.Optional(Type.Integer({ minimum: 1 })),
	targetUrl: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Null()])),
});

const FireScheduledJobSchema = Type.Object({
	correlationId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

const SyncScheduledJobsSchema = Type.Object({
	clientId: Type.Union([Type.String(), Type.Null()]),
	archiveUnlisted: Type.Optional(Type.Boolean()),
	scheduledJobs: Type.Array(
		Type.Object({
			code: Type.String({ minLength: 1, maxLength: 200 }),
			name: Type.String({ minLength: 1, maxLength: 200 }),
			description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
			crons: Type.Array(Type.String(), { minItems: 1 }),
			timezone: Type.Optional(Type.String()),
			payload: Type.Optional(Type.Unknown()),
			concurrent: Type.Optional(Type.Boolean()),
			tracksCompletion: Type.Optional(Type.Boolean()),
			timeoutSeconds: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
			deliveryMaxAttempts: Type.Optional(Type.Integer({ minimum: 1 })),
			targetUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		}),
	),
});

const ListQuerySchema = Type.Object({
	clientId: Type.Optional(Type.String()),
	platformScoped: Type.Optional(Type.Boolean()),
	status: Type.Optional(StatusEnum),
	search: Type.Optional(Type.String()),
	limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 500 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
});

const ListResponseSchema = Type.Object({
	scheduledJobs: Type.Array(ScheduledJobResponseSchema),
	total: Type.Integer(),
});

const InstanceResponseSchema = Type.Object({
	id: Type.String(),
	scheduledJobId: Type.String(),
	clientId: Type.Union([Type.String(), Type.Null()]),
	jobCode: Type.String(),
	triggerKind: TriggerKindEnum,
	scheduledFor: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
	firedAt: Type.String({ format: "date-time" }),
	deliveredAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
	completedAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
	status: InstanceStatusEnum,
	deliveryAttempts: Type.Integer(),
	deliveryError: Type.Union([Type.String(), Type.Null()]),
	completionStatus: Type.Union([CompletionStatusEnum, Type.Null()]),
	completionResult: Type.Unknown(),
	correlationId: Type.Union([Type.String(), Type.Null()]),
	createdAt: Type.String({ format: "date-time" }),
});

const InstancesListResponseSchema = Type.Object({
	instances: Type.Array(InstanceResponseSchema),
	total: Type.Integer(),
});

const InstanceLogResponseSchema = Type.Object({
	id: Type.String(),
	instanceId: Type.String(),
	scheduledJobId: Type.Union([Type.String(), Type.Null()]),
	clientId: Type.Union([Type.String(), Type.Null()]),
	level: LogLevelEnum,
	message: Type.String(),
	metadata: Type.Unknown(),
	createdAt: Type.String({ format: "date-time" }),
});

const InstanceLogsListResponseSchema = Type.Object({
	logs: Type.Array(InstanceLogResponseSchema),
});

const AddInstanceLogSchema = Type.Object({
	level: Type.Optional(LogLevelEnum),
	message: Type.String({ minLength: 1 }),
	metadata: Type.Optional(Type.Unknown()),
});

const CompleteInstanceSchema = Type.Object({
	status: CompletionStatusEnum,
	result: Type.Optional(Type.Unknown()),
});

const InstancesQuerySchema = Type.Object({
	scheduledJobId: Type.Optional(Type.String()),
	clientId: Type.Optional(Type.String()),
	status: Type.Optional(InstanceStatusEnum),
	triggerKind: Type.Optional(TriggerKindEnum),
	from: Type.Optional(Type.String({ format: "date-time" })),
	to: Type.Optional(Type.String({ format: "date-time" })),
	limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 500 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
});

const IdParam = Type.Object({ id: Type.String() });
const InstanceIdParam = Type.Object({ instanceId: Type.String() });

// ─── Mapping ────────────────────────────────────────────────────────────────

function toJobResponse(job: ScheduledJob): Static<typeof ScheduledJobResponseSchema> {
	return {
		id: job.id,
		clientId: job.clientId,
		code: job.code,
		name: job.name,
		description: job.description,
		status: job.status,
		crons: [...job.crons],
		timezone: job.timezone,
		payload: job.payload,
		concurrent: job.concurrent,
		tracksCompletion: job.tracksCompletion,
		timeoutSeconds: job.timeoutSeconds,
		deliveryMaxAttempts: job.deliveryMaxAttempts,
		targetUrl: job.targetUrl,
		lastFiredAt: job.lastFiredAt ? job.lastFiredAt.toISOString() : null,
		createdAt: job.createdAt.toISOString(),
		updatedAt: job.updatedAt.toISOString(),
		createdBy: job.createdBy,
		updatedBy: job.updatedBy,
		version: job.version,
	};
}

function toInstanceResponse(
	inst: ScheduledJobInstance,
): Static<typeof InstanceResponseSchema> {
	return {
		id: inst.id,
		scheduledJobId: inst.scheduledJobId,
		clientId: inst.clientId,
		jobCode: inst.jobCode,
		triggerKind: inst.triggerKind,
		scheduledFor: inst.scheduledFor ? inst.scheduledFor.toISOString() : null,
		firedAt: inst.firedAt.toISOString(),
		deliveredAt: inst.deliveredAt ? inst.deliveredAt.toISOString() : null,
		completedAt: inst.completedAt ? inst.completedAt.toISOString() : null,
		status: inst.status,
		deliveryAttempts: inst.deliveryAttempts,
		deliveryError: inst.deliveryError,
		completionStatus: inst.completionStatus,
		completionResult: inst.completionResult,
		correlationId: inst.correlationId,
		createdAt: inst.createdAt.toISOString(),
	};
}

function toLogResponse(
	log: ScheduledJobInstanceLog,
): Static<typeof InstanceLogResponseSchema> {
	return {
		id: log.id,
		instanceId: log.instanceId,
		scheduledJobId: log.scheduledJobId,
		clientId: log.clientId,
		level: log.level,
		message: log.message,
		metadata: log.metadata,
		createdAt: log.createdAt.toISOString(),
	};
}

// ─── Routes ─────────────────────────────────────────────────────────────────

export interface ScheduledJobsRoutesDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly scheduledJobInstanceRepository?: ScheduledJobInstanceRepository | undefined;
	readonly createScheduledJobUseCase: UseCase<
		CreateScheduledJobCommand,
		ScheduledJobCreated
	>;
	readonly updateScheduledJobUseCase: UseCase<
		UpdateScheduledJobCommand,
		ScheduledJobUpdated
	>;
	readonly pauseScheduledJobUseCase: UseCase<
		PauseScheduledJobCommand,
		ScheduledJobPaused
	>;
	readonly resumeScheduledJobUseCase: UseCase<
		ResumeScheduledJobCommand,
		ScheduledJobResumed
	>;
	readonly archiveScheduledJobUseCase: UseCase<
		ArchiveScheduledJobCommand,
		ScheduledJobArchived
	>;
	readonly deleteScheduledJobUseCase: UseCase<
		DeleteScheduledJobCommand,
		ScheduledJobDeleted
	>;
	readonly fireScheduledJobUseCase: UseCase<
		FireScheduledJobCommand,
		ScheduledJobFired
	>;
	readonly syncScheduledJobsUseCase: UseCase<
		SyncScheduledJobsCommand,
		ScheduledJobsSynced
	>;
}

export async function registerScheduledJobsRoutes(
	fastify: FastifyInstance,
	deps: ScheduledJobsRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		scheduledJobRepository,
		scheduledJobInstanceRepository,
		createScheduledJobUseCase,
		updateScheduledJobUseCase,
		pauseScheduledJobUseCase,
		resumeScheduledJobUseCase,
		archiveScheduledJobUseCase,
		deleteScheduledJobUseCase,
		fireScheduledJobUseCase,
		syncScheduledJobsUseCase,
	} = deps;

	// POST /api/scheduled-jobs — create
	f.post(
		"/scheduled-jobs",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.CREATE),
			schema: {
				body: CreateScheduledJobSchema,
				response: {
					201: ScheduledJobResponseSchema,
					400: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as Static<typeof CreateScheduledJobSchema>;
			const command: CreateScheduledJobCommand = {
				clientId: body.clientId ?? null,
				code: body.code,
				name: body.name,
				description: body.description ?? null,
				crons: body.crons,
				timezone: body.timezone,
				payload: body.payload,
				concurrent: body.concurrent,
				tracksCompletion: body.tracksCompletion,
				timeoutSeconds: body.timeoutSeconds,
				deliveryMaxAttempts: body.deliveryMaxAttempts,
				targetUrl: body.targetUrl,
			};
			const result = await createScheduledJobUseCase.execute(
				command,
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				const job = await scheduledJobRepository.findById(
					result.value.getData().scheduledJobId,
				);
				if (job) return jsonCreated(reply, toJobResponse(job));
			}
			return sendResult(reply, result);
		},
	);

	// GET /api/scheduled-jobs — list with filters
	f.get(
		"/scheduled-jobs",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.READ),
			schema: {
				querystring: ListQuerySchema,
				response: { 200: ListResponseSchema },
			},
		},
		async (request, reply) => {
			const q = request.query as Static<typeof ListQuerySchema>;
			const applyClientFilter =
				q.clientId !== undefined || q.platformScoped === true;
			const filters = {
				applyClientFilter,
				clientId: q.platformScoped === true ? null : (q.clientId ?? undefined),
				status: q.status,
				search: q.search,
				limit: q.limit,
				offset: q.offset,
			};
			const [jobs, total] = await Promise.all([
				scheduledJobRepository.findWithFilters(filters),
				scheduledJobRepository.countWithFilters({
					applyClientFilter,
					clientId: filters.clientId,
					status: q.status,
					search: q.search,
				}),
			]);
			return jsonSuccess(reply, {
				scheduledJobs: jobs.map(toJobResponse),
				total,
			});
		},
	);

	// GET /api/scheduled-jobs/:id
	f.get(
		"/scheduled-jobs/:id",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: ScheduledJobResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const job = await scheduledJobRepository.findById(id);
			if (!job) return notFound(reply, `Scheduled job not found: ${id}`);
			return jsonSuccess(reply, toJobResponse(job));
		},
	);

	// PATCH /api/scheduled-jobs/:id — update
	f.patch(
		"/scheduled-jobs/:id",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				body: UpdateScheduledJobSchema,
				response: {
					200: ScheduledJobResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as Static<typeof UpdateScheduledJobSchema>;
			const command: UpdateScheduledJobCommand = {
				scheduledJobId: id,
				...body,
			};
			const result = await updateScheduledJobUseCase.execute(
				command,
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				const job = await scheduledJobRepository.findById(id);
				if (job) return jsonSuccess(reply, toJobResponse(job));
			}
			return sendResult(reply, result);
		},
	);

	// POST /api/scheduled-jobs/:id/pause
	f.post(
		"/scheduled-jobs/:id/pause",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.PAUSE),
			schema: {
				params: IdParam,
				response: {
					200: ScheduledJobResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const result = await pauseScheduledJobUseCase.execute(
				{ scheduledJobId: id },
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				const job = await scheduledJobRepository.findById(id);
				if (job) return jsonSuccess(reply, toJobResponse(job));
			}
			return sendResult(reply, result);
		},
	);

	// POST /api/scheduled-jobs/:id/resume
	f.post(
		"/scheduled-jobs/:id/resume",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.PAUSE),
			schema: {
				params: IdParam,
				response: {
					200: ScheduledJobResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const result = await resumeScheduledJobUseCase.execute(
				{ scheduledJobId: id },
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				const job = await scheduledJobRepository.findById(id);
				if (job) return jsonSuccess(reply, toJobResponse(job));
			}
			return sendResult(reply, result);
		},
	);

	// POST /api/scheduled-jobs/:id/archive
	f.post(
		"/scheduled-jobs/:id/archive",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				response: {
					200: ScheduledJobResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const result = await archiveScheduledJobUseCase.execute(
				{ scheduledJobId: id },
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				const job = await scheduledJobRepository.findById(id);
				if (job) return jsonSuccess(reply, toJobResponse(job));
			}
			return sendResult(reply, result);
		},
	);

	// DELETE /api/scheduled-jobs/:id
	f.delete(
		"/scheduled-jobs/:id",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.DELETE),
			schema: {
				params: IdParam,
				response: { 204: Type.Null(), 404: ErrorResponseSchema },
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const result = await deleteScheduledJobUseCase.execute(
				{ scheduledJobId: id },
				request.executionContext,
			);
			if (Result.isSuccess(result)) return noContent(reply);
			return sendResult(reply, result);
		},
	);

	// POST /api/scheduled-jobs/:id/fire — manually fire now
	f.post(
		"/scheduled-jobs/:id/fire",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.FIRE),
			schema: {
				params: IdParam,
				body: FireScheduledJobSchema,
				response: {
					202: Type.Object({
						instanceId: Type.String(),
					}),
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as Static<typeof FireScheduledJobSchema>;
			const result = await fireScheduledJobUseCase.execute(
				{ scheduledJobId: id, correlationId: body.correlationId ?? null },
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				return reply
					.code(202)
					.send({ instanceId: result.value.getData().instanceId });
			}
			return sendResult(reply, result);
		},
	);

	// POST /api/scheduled-jobs/sync — bulk sync from SDK
	f.post(
		"/scheduled-jobs/sync",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.SYNC),
			schema: {
				body: SyncScheduledJobsSchema,
				response: {
					200: Type.Object({
						clientId: Type.Union([Type.String(), Type.Null()]),
						synced: Type.Integer(),
						created: Type.Integer(),
						updated: Type.Integer(),
					}),
					400: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as Static<typeof SyncScheduledJobsSchema>;
			const result = await syncScheduledJobsUseCase.execute(
				body,
				request.executionContext,
			);
			if (Result.isSuccess(result)) {
				return jsonSuccess(reply, result.value.getData());
			}
			return sendResult(reply, result);
		},
	);

	// ── Instance routes ─────────────────────────────────────────────────────

	// GET /api/scheduled-jobs/instances — list instances across jobs
	f.get(
		"/scheduled-jobs/instances",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.INSTANCE_READ),
			schema: {
				querystring: InstancesQuerySchema,
				response: {
					200: InstancesListResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			if (!scheduledJobInstanceRepository) {
				return notFound(reply, "Scheduled-job instances are not configured");
			}
			const q = request.query as Static<typeof InstancesQuerySchema>;
			const filters = {
				scheduledJobId: q.scheduledJobId,
				clientId: q.clientId,
				status: q.status,
				triggerKind: q.triggerKind,
				from: q.from ? new Date(q.from) : undefined,
				to: q.to ? new Date(q.to) : undefined,
				limit: q.limit,
				offset: q.offset,
			};
			const [instances, total] = await Promise.all([
				scheduledJobInstanceRepository.list(filters),
				scheduledJobInstanceRepository.count({
					scheduledJobId: filters.scheduledJobId,
					clientId: filters.clientId,
					status: filters.status,
					triggerKind: filters.triggerKind,
					from: filters.from,
					to: filters.to,
				}),
			]);
			return jsonSuccess(reply, {
				instances: instances.map(toInstanceResponse),
				total,
			});
		},
	);

	// GET /api/scheduled-jobs/instances/:id — fetch single instance
	f.get(
		"/scheduled-jobs/instances/:instanceId",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.INSTANCE_READ),
			schema: {
				params: InstanceIdParam,
				response: { 200: InstanceResponseSchema, 404: ErrorResponseSchema },
			},
		},
		async (request, reply) => {
			if (!scheduledJobInstanceRepository) {
				return notFound(reply, "Scheduled-job instances are not configured");
			}
			const { instanceId: id } = request.params as Static<typeof InstanceIdParam>;
			const inst = await scheduledJobInstanceRepository.findById(id);
			if (!inst) return notFound(reply, `Instance not found: ${id}`);
			return jsonSuccess(reply, toInstanceResponse(inst));
		},
	);

	// GET /api/scheduled-jobs/instances/:id/logs
	f.get(
		"/scheduled-jobs/instances/:instanceId/logs",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.INSTANCE_READ),
			schema: {
				params: InstanceIdParam,
				querystring: Type.Object({
					limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 1000 })),
				}),
				response: {
					200: InstanceLogsListResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			if (!scheduledJobInstanceRepository) {
				return notFound(reply, "Scheduled-job instances are not configured");
			}
			const { instanceId: id } = request.params as Static<typeof InstanceIdParam>;
			const { limit } = request.query as { limit?: number };
			const logs = await scheduledJobInstanceRepository.listLogsForInstance(
				id,
				limit,
			);
			return jsonSuccess(reply, { logs: logs.map(toLogResponse) });
		},
	);

	// POST /api/scheduled-jobs/instances/:id/log — SDK callback to append a log
	f.post(
		"/scheduled-jobs/instances/:instanceId/log",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.INSTANCE_WRITE),
			schema: {
				params: InstanceIdParam,
				body: AddInstanceLogSchema,
				response: {
					201: InstanceLogResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			if (!scheduledJobInstanceRepository) {
				return notFound(reply, "Scheduled-job instances are not configured");
			}
			const { instanceId: id } = request.params as Static<typeof InstanceIdParam>;
			const body = request.body as Static<typeof AddInstanceLogSchema>;
			const inst = await scheduledJobInstanceRepository.findById(id);
			if (!inst) return notFound(reply, `Instance not found: ${id}`);
			const log = await scheduledJobInstanceRepository.insertLog({
				instanceId: id,
				scheduledJobId: inst.scheduledJobId,
				clientId: inst.clientId,
				level: (body.level as LogLevel | undefined) ?? "INFO",
				message: body.message,
				metadata: body.metadata,
			});
			return jsonCreated(reply, toLogResponse(log));
		},
	);

	// POST /api/scheduled-jobs/instances/:id/complete — SDK callback for completion
	f.post(
		"/scheduled-jobs/instances/:instanceId/complete",
		{
			preHandler: requirePermission(SCHEDULED_JOB_PERMISSIONS.INSTANCE_WRITE),
			schema: {
				params: InstanceIdParam,
				body: CompleteInstanceSchema,
				response: {
					204: Type.Null(),
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			if (!scheduledJobInstanceRepository) {
				return notFound(reply, "Scheduled-job instances are not configured");
			}
			const { instanceId: id } = request.params as Static<typeof InstanceIdParam>;
			const body = request.body as Static<typeof CompleteInstanceSchema>;
			const inst = await scheduledJobInstanceRepository.findById(id);
			if (!inst) return notFound(reply, `Instance not found: ${id}`);
			await scheduledJobInstanceRepository.recordCompletion(
				id,
				inst.createdAt,
				body.status as CompletionStatus,
				body.result ?? null,
			);
			return noContent(reply);
		},
	);
}
