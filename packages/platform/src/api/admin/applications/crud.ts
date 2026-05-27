/**
 * Applications admin API — CRUD routes plus the read-only roles endpoint.
 *
 *   POST   /applications
 *   GET    /applications
 *   GET    /applications/:id
 *   GET    /applications/by-code/:code
 *   PUT    /applications/:id
 *   DELETE /applications/:id
 *   GET    /applications/:id/roles
 */

import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type, type Static } from "@sinclair/typebox";
import {
	ErrorResponseSchema,
	jsonCreated,
	jsonSuccess,
	noContent,
	notFound,
	sendResult,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";

import type {
	CreateApplicationCommand,
	DeleteApplicationCommand,
	UpdateApplicationCommand,
	CreateServiceAccountCommand,
} from "../../../application/index.js";
import type { ApplicationType } from "../../../domain/index.js";
import { requirePermission } from "../../../authorization/index.js";
import { APPLICATION_PERMISSIONS } from "../../../authorization/permissions/platform-admin.js";

import type { ApplicationsRoutesDeps } from "./index.js";
import { toApplicationResponse } from "./mappers.js";
import type { AppHasLoginClientFn } from "./provisioning.js";
import {
	ApplicationResponseSchema,
	ApplicationRolesResponseSchema,
	ApplicationsListResponseSchema,
	CodeParam,
	CreateApplicationSchema,
	IdParam,
	ListApplicationsQuery,
	UpdateApplicationSchema,
	type CreateApplicationBody,
	type UpdateApplicationBody,
} from "./schemas.js";

export interface CrudRoutesContext {
	readonly appHasLoginClient: AppHasLoginClientFn;
}

export async function registerCrudRoutes(
	fastify: FastifyInstance,
	deps: ApplicationsRoutesDeps,
	ctx: CrudRoutesContext,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		applicationRepository,
		roleRepository,
		createApplicationUseCase,
		updateApplicationUseCase,
		deleteApplicationUseCase,
		createServiceAccountUseCase,
		attachServiceAccountToApplicationUseCase,
	} = deps;
	const { appHasLoginClient } = ctx;

	// POST /api/applications - Create application
	f.post(
		"/applications",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.CREATE),
			schema: {
				body: CreateApplicationSchema,
				response: {
					201: ApplicationResponseSchema,
					400: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as CreateApplicationBody;
			const ctx = request.executionContext;

			const command: CreateApplicationCommand = {
				code: body.code,
				name: body.name,
				...(body.type !== undefined && { type: body.type as ApplicationType }),
				description: body.description ?? null,
				iconUrl: body.iconUrl ?? null,
				website: body.website ?? null,
				logo: body.logo ?? null,
				logoMimeType: body.logoMimeType ?? null,
				defaultBaseUrl: body.defaultBaseUrl ?? null,
			};

			const result = await createApplicationUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const applicationId = result.value.getData().applicationId;
				let application = await applicationRepository.findById(applicationId);

				if (application) {
					// Auto-provision service account (Java parity)
					const saCommand: CreateServiceAccountCommand = {
						code: `${body.code}-service`,
						name: `${body.name} Service Account`,
						description: `Auto-provisioned service account for ${body.name}`,
						applicationId,
						clientId: null,
					};

					const saResult = await createServiceAccountUseCase.execute(
						saCommand,
						ctx,
					);

					if (Result.isSuccess(saResult)) {
						const saData = saResult.value.getData();
						const attachResult =
							await attachServiceAccountToApplicationUseCase.execute(
								{
									applicationId: application.id,
									serviceAccountId: saData.principalId,
									serviceAccountCode: saData.code,
								},
								ctx,
							);
						if (Result.isFailure(attachResult)) {
							return sendResult(reply, attachResult);
						}
						const refreshed = await applicationRepository.findById(
							application.id,
						);
						application = refreshed ?? application;
					}

					return jsonCreated(reply, toApplicationResponse(application));
				}
			}

			return sendResult(reply, result);
		},
	);

	// GET /api/applications - List applications
	f.get(
		"/applications",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.READ),
			schema: {
				querystring: ListApplicationsQuery,
				response: {
					200: ApplicationsListResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const query = request.query as Static<typeof ListApplicationsQuery>;
			const page = parseInt(query.page ?? "0", 10);
			const pageSize = Math.min(parseInt(query.pageSize ?? "20", 10), 100);

			const pagedResult = await applicationRepository.findPaged(page, pageSize);

			// Apply in-memory filters for activeOnly and type
			let filtered = pagedResult.items;
			if (query.activeOnly === "true") {
				filtered = filtered.filter((a) => a.active);
			}
			if (query.type) {
				filtered = filtered.filter((a) => a.type === query.type);
			}

			return jsonSuccess(reply, {
				applications: filtered.map(toApplicationResponse),
				total: filtered.length,
				page: pagedResult.page,
				pageSize: pagedResult.pageSize,
			});
		},
	);

	// GET /api/applications/:id - Get application by ID
	f.get(
		"/applications/:id",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const application = await applicationRepository.findById(id);

			if (!application) {
				return notFound(reply, `Application not found: ${id}`);
			}

			const hasLoginClient = await appHasLoginClient(application.id);
			return jsonSuccess(reply, {
				...toApplicationResponse(application),
				hasLoginClient,
			});
		},
	);

	// GET /api/applications/by-code/:code - Get application by code
	f.get(
		"/applications/by-code/:code",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.READ),
			schema: {
				params: CodeParam,
				response: {
					200: ApplicationResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { code } = request.params as Static<typeof CodeParam>;
			const application = await applicationRepository.findByCode(code);

			if (!application) {
				return notFound(reply, `Application not found with code: ${code}`);
			}

			return jsonSuccess(reply, toApplicationResponse(application));
		},
	);

	// PUT /api/applications/:id - Update application
	f.put(
		"/applications/:id",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				body: UpdateApplicationSchema,
				response: {
					200: ApplicationResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as UpdateApplicationBody;
			const ctx = request.executionContext;

			const command: UpdateApplicationCommand = {
				applicationId: id,
				name: body.name,
				description: body.description ?? null,
				iconUrl: body.iconUrl ?? null,
				website: body.website ?? null,
				logo: body.logo ?? null,
				logoMimeType: body.logoMimeType ?? null,
				defaultBaseUrl: body.defaultBaseUrl ?? null,
			};

			const result = await updateApplicationUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const application = await applicationRepository.findById(id);
				if (application) {
					return jsonSuccess(reply, toApplicationResponse(application));
				}
			}

			return sendResult(reply, result);
		},
	);

	// DELETE /api/applications/:id - Delete application
	f.delete(
		"/applications/:id",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.DELETE),
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

			const command: DeleteApplicationCommand = {
				applicationId: id,
			};

			const result = await deleteApplicationUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				return noContent(reply);
			}

			return sendResult(reply, result);
		},
	);

	// GET /api/applications/:id/roles - Get roles for application (Java parity)
	f.get(
		"/applications/:id/roles",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationRolesResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;

			const application = await applicationRepository.findById(id);
			if (!application) {
				return notFound(reply, `Application not found: ${id}`);
			}

			const roles = await roleRepository.findByApplicationId(id);

			return jsonSuccess(reply, {
				roles: roles.map((r) => ({
					id: r.id,
					name: r.name,
					displayName: r.displayName,
					description: r.description,
					permissions: [...r.permissions],
					clientManaged: r.clientManaged,
				})),
			});
		},
	);
}
