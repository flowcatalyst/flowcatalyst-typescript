/**
 * Processes Admin API
 *
 * REST endpoints for process documentation. Process bodies are stored verbatim
 * (typically Mermaid source) and rendered client-side.
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
	CreateProcessCommand,
	UpdateProcessCommand,
	ArchiveProcessCommand,
	DeleteProcessCommand,
} from "../../application/index.js";
import type {
	Process,
	ProcessCreated,
	ProcessUpdated,
	ProcessArchived,
	ProcessDeleted,
	ProcessStatus,
} from "../../domain/index.js";
import type { ProcessRepository } from "../../infrastructure/persistence/index.js";
import { requirePermission } from "../../authorization/index.js";
import { PROCESS_PERMISSIONS } from "../../authorization/permissions/platform-admin.js";

// ─── Request Schemas ────────────────────────────────────────────────────────

const CreateProcessSchema = Type.Object({
	code: Type.String({ minLength: 1, maxLength: 255 }),
	name: Type.String({ minLength: 1, maxLength: 255 }),
	description: Type.Optional(
		Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
	),
	body: Type.Optional(Type.String()),
	diagramType: Type.Optional(Type.String({ maxLength: 20 })),
	tags: Type.Optional(Type.Array(Type.String())),
});

const UpdateProcessSchema = Type.Object({
	name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
	description: Type.Optional(
		Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
	),
	body: Type.Optional(Type.String()),
	diagramType: Type.Optional(Type.String({ maxLength: 20 })),
	tags: Type.Optional(Type.Array(Type.String())),
});

const IdParam = Type.Object({ id: Type.String() });
const CodeParam = Type.Object({ code: Type.String() });

const ProcessListQuerySchema = Type.Object({
	application: Type.Optional(Type.String()),
	subdomain: Type.Optional(Type.String()),
	status: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
});

// ─── Response Schemas ───────────────────────────────────────────────────────

const ProcessResponseSchema = Type.Object({
	id: Type.String(),
	code: Type.String(),
	name: Type.String(),
	description: Type.Union([Type.String(), Type.Null()]),
	status: Type.String(),
	source: Type.String(),
	application: Type.String(),
	subdomain: Type.String(),
	processName: Type.String(),
	body: Type.String(),
	diagramType: Type.String(),
	tags: Type.Array(Type.String()),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});

const ProcessListResponseSchema = Type.Object({
	items: Type.Array(ProcessResponseSchema),
});

const CreatedIdResponseSchema = Type.Object({
	id: Type.String(),
});

type ProcessResponse = Static<typeof ProcessResponseSchema>;

/**
 * Dependencies for the Processes admin API.
 */
export interface ProcessesRoutesDeps {
	readonly processRepository: ProcessRepository;
	readonly createProcessUseCase: UseCase<CreateProcessCommand, ProcessCreated>;
	readonly updateProcessUseCase: UseCase<UpdateProcessCommand, ProcessUpdated>;
	readonly archiveProcessUseCase: UseCase<
		ArchiveProcessCommand,
		ProcessArchived
	>;
	readonly deleteProcessUseCase: UseCase<DeleteProcessCommand, ProcessDeleted>;
}

/**
 * Register Processes admin API routes.
 */
export async function registerProcessesRoutes(
	fastify: FastifyInstance,
	deps: ProcessesRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		processRepository,
		createProcessUseCase,
		updateProcessUseCase,
		archiveProcessUseCase,
		deleteProcessUseCase,
	} = deps;

	// POST /processes — Create a process
	f.post(
		"/processes",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.CREATE),
			schema: {
				body: CreateProcessSchema,
				response: {
					201: CreatedIdResponseSchema,
					400: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as Static<typeof CreateProcessSchema>;
			const ctx = request.executionContext;

			const command: CreateProcessCommand = {
				code: body.code,
				name: body.name,
				description: body.description ?? null,
				body: body.body ?? "",
				diagramType: body.diagramType ?? null,
				tags: body.tags ?? [],
			};

			const result = await createProcessUseCase.execute(command, ctx);
			if (Result.isSuccess(result)) {
				return jsonCreated(reply, { id: result.value.getData().processId });
			}
			return sendResult(reply, result);
		},
	);

	// GET /processes — List processes
	f.get(
		"/processes",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.READ),
			schema: {
				querystring: ProcessListQuerySchema,
				response: {
					200: ProcessListResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const query = request.query as Static<typeof ProcessListQuerySchema>;

			// Default to CURRENT when no filters specified.
			const defaultStatus: ProcessStatus | undefined =
				query.application === undefined &&
				query.subdomain === undefined &&
				query.status === undefined &&
				(query.search === undefined || query.search.trim() === "")
					? "CURRENT"
					: query.status
						? (query.status as ProcessStatus)
						: undefined;

			const items = await processRepository.findWithFilters({
				application: query.application,
				subdomain: query.subdomain,
				status: defaultStatus,
				search: query.search,
			});

			return jsonSuccess(reply, {
				items: items.map(toProcessResponse),
			});
		},
	);

	// GET /processes/:id — Get process by id
	f.get(
		"/processes/:id",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: ProcessResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const process = await processRepository.findById(id);
			if (!process) {
				return notFound(reply, `Process not found: ${id}`);
			}
			return jsonSuccess(reply, toProcessResponse(process));
		},
	);

	// GET /processes/by-code/:code — Get process by code
	f.get(
		"/processes/by-code/:code",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.READ),
			schema: {
				params: CodeParam,
				response: {
					200: ProcessResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { code } = request.params as Static<typeof CodeParam>;
			const process = await processRepository.findByCode(code);
			if (!process) {
				return notFound(reply, `Process not found: ${code}`);
			}
			return jsonSuccess(reply, toProcessResponse(process));
		},
	);

	// PUT /processes/:id — Update process
	f.put(
		"/processes/:id",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				body: UpdateProcessSchema,
				response: {
					204: Type.Null(),
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as Static<typeof UpdateProcessSchema>;
			const ctx = request.executionContext;

			const command: UpdateProcessCommand = {
				processId: id,
				...(body.name !== undefined ? { name: body.name } : {}),
				...(body.description !== undefined
					? { description: body.description }
					: {}),
				...(body.body !== undefined ? { body: body.body } : {}),
				...(body.diagramType !== undefined
					? { diagramType: body.diagramType }
					: {}),
				...(body.tags !== undefined ? { tags: body.tags } : {}),
			};

			const result = await updateProcessUseCase.execute(command, ctx);
			if (Result.isSuccess(result)) {
				return noContent(reply);
			}
			return sendResult(reply, result);
		},
	);

	// POST /processes/:id/archive — Archive a process
	f.post(
		"/processes/:id/archive",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.ARCHIVE),
			schema: {
				params: IdParam,
				response: {
					204: Type.Null(),
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			const result = await archiveProcessUseCase.execute(
				{ processId: id },
				ctx,
			);
			if (Result.isSuccess(result)) {
				return noContent(reply);
			}
			return sendResult(reply, result);
		},
	);

	// DELETE /processes/:id — Delete a (previously archived) process
	f.delete(
		"/processes/:id",
		{
			preHandler: requirePermission(PROCESS_PERMISSIONS.DELETE),
			schema: {
				params: IdParam,
				response: {
					204: Type.Null(),
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			const result = await deleteProcessUseCase.execute(
				{ processId: id },
				ctx,
			);
			if (Result.isSuccess(result)) {
				return noContent(reply);
			}
			return sendResult(reply, result);
		},
	);
}

function toProcessResponse(process: Process): ProcessResponse {
	return {
		id: process.id,
		code: process.code,
		name: process.name,
		description: process.description,
		status: process.status,
		source: process.source,
		application: process.application,
		subdomain: process.subdomain,
		processName: process.processName,
		body: process.body,
		diagramType: process.diagramType,
		tags: process.tags,
		createdAt: process.createdAt.toISOString(),
		updatedAt: process.updatedAt.toISOString(),
	};
}
