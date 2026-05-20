/**
 * Applications Admin API
 *
 * REST endpoints for application management.
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
	badRequest,
	jsonError,
	ErrorResponseSchema,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";
import type { UseCase } from "@flowcatalyst/application";
import type { EncryptionService } from "@flowcatalyst/platform-crypto";
import { randomBytes } from "node:crypto";

import type {
	CreateApplicationCommand,
	UpdateApplicationCommand,
	DeleteApplicationCommand,
	EnableApplicationForClientCommand,
	DisableApplicationForClientCommand,
	ActivateApplicationCommand,
	DeactivateApplicationCommand,
	CreateServiceAccountCommand,
	AttachServiceAccountToApplicationCommand,
	CreateOAuthClientCommand,
} from "../../application/index.js";
import type {
	ApplicationCreated,
	ApplicationUpdated,
	ApplicationDeleted,
	ApplicationEnabledForClient,
	ApplicationDisabledForClient,
	ApplicationActivated,
	ApplicationDeactivated,
	ApplicationType,
	ServiceAccountCreated,
	ApplicationServiceAccountProvisioned,
	OAuthClientCreated,
} from "../../domain/index.js";
import type {
	ApplicationRepository,
	ApplicationClientConfigRepository,
	RoleRepository,
	PrincipalRepository,
	OAuthClientRepository,
} from "../../infrastructure/persistence/index.js";
import { requirePermission } from "../../authorization/index.js";
import { APPLICATION_PERMISSIONS } from "../../authorization/permissions/platform-admin.js";

// ─── Request Schemas ────────────────────────────────────────────────────────

const CreateApplicationSchema = Type.Object({
	code: Type.String({ minLength: 1, maxLength: 50 }),
	name: Type.String({ minLength: 1, maxLength: 255 }),
	type: Type.Optional(
		Type.Union([Type.Literal("APPLICATION"), Type.Literal("INTEGRATION")]),
	),
	description: Type.Optional(
		Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
	),
	iconUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	website: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	logo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	logoMimeType: Type.Optional(
		Type.Union([Type.String({ maxLength: 100 }), Type.Null()]),
	),
	defaultBaseUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
});

const UpdateApplicationSchema = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	description: Type.Optional(
		Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
	),
	iconUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	website: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
	logo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	logoMimeType: Type.Optional(
		Type.Union([Type.String({ maxLength: 100 }), Type.Null()]),
	),
	defaultBaseUrl: Type.Optional(
		Type.Union([Type.String({ maxLength: 500 }), Type.Null()]),
	),
});

const ClientIdSchema = Type.Object({
	clientId: Type.String({ minLength: 13, maxLength: 13 }),
});

const IdParam = Type.Object({ id: Type.String() });
const CodeParam = Type.Object({ code: Type.String() });
const IdClientIdParam = Type.Object({
	id: Type.String(),
	clientId: Type.String(),
});

const ListApplicationsQuery = Type.Object({
	page: Type.Optional(Type.String()),
	pageSize: Type.Optional(Type.String()),
	type: Type.Optional(Type.String()),
	activeOnly: Type.Optional(Type.String()),
});

type CreateApplicationBody = Static<typeof CreateApplicationSchema>;
type UpdateApplicationBody = Static<typeof UpdateApplicationSchema>;
type ClientIdBody = Static<typeof ClientIdSchema>;

// ─── Response Schemas ───────────────────────────────────────────────────────

const ApplicationResponseSchema = Type.Object({
	id: Type.String(),
	type: Type.String(),
	code: Type.String(),
	name: Type.String(),
	description: Type.Union([Type.String(), Type.Null()]),
	iconUrl: Type.Union([Type.String(), Type.Null()]),
	website: Type.Union([Type.String(), Type.Null()]),
	logo: Type.Union([Type.String(), Type.Null()]),
	logoMimeType: Type.Union([Type.String(), Type.Null()]),
	defaultBaseUrl: Type.Union([Type.String(), Type.Null()]),
	serviceAccountId: Type.Union([Type.String(), Type.Null()]),
	active: Type.Boolean(),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
	// True iff this application has an authorization_code OAuth client
	// (login client) provisioned. Returned on detail GET only — list GET
	// omits it to avoid N+1.
	hasLoginClient: Type.Optional(Type.Boolean()),
});

const ApplicationsListResponseSchema = Type.Object({
	applications: Type.Array(ApplicationResponseSchema),
	total: Type.Integer(),
	page: Type.Integer(),
	pageSize: Type.Integer(),
});

const ApplicationClientConfigResponseSchema = Type.Object({
	id: Type.String(),
	applicationId: Type.String(),
	clientId: Type.String(),
	enabled: Type.Boolean(),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});

const ApplicationClientConfigsListResponseSchema = Type.Object({
	configs: Type.Array(ApplicationClientConfigResponseSchema),
});

const ApplicationRolesResponseSchema = Type.Object({
	roles: Type.Array(
		Type.Object({
			id: Type.String(),
			name: Type.String(),
			displayName: Type.String(),
			description: Type.Union([Type.String(), Type.Null()]),
			permissions: Type.Array(Type.String()),
			clientManaged: Type.Boolean(),
		}),
	),
});

const OAuthClientCredentialsSchema = Type.Object({
	id: Type.String(),
	clientId: Type.String(),
	clientSecret: Type.Optional(Type.String()),
});

const ServiceAccountCredentialsSchema = Type.Object({
	principalId: Type.String(),
	name: Type.String(),
	oauthClient: OAuthClientCredentialsSchema,
});

const ProvisionServiceAccountResponseSchema = Type.Object({
	message: Type.String(),
	serviceAccount: ServiceAccountCredentialsSchema,
});

const ProvisionServiceAccountSchema = Type.Object({
	code: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
	name: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
});

const LoginClientTypeSchema = Type.Union([
	Type.Literal("PUBLIC"),
	Type.Literal("CONFIDENTIAL"),
]);

const ProvisionLoginClientRequestSchema = Type.Object({
	clientType: Type.Optional(LoginClientTypeSchema),
	redirectUris: Type.Array(Type.String({ minLength: 1 }), { minItems: 1 }),
	allowedOrigins: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
});

const LoginClientCredentialsSchema = Type.Object({
	clientType: LoginClientTypeSchema,
	redirectUris: Type.Array(Type.String()),
	oauthClient: OAuthClientCredentialsSchema,
});

const ProvisionLoginClientResponseSchema = Type.Object({
	message: Type.String(),
	loginClient: LoginClientCredentialsSchema,
});

type ApplicationResponse = Static<typeof ApplicationResponseSchema>;
type ApplicationClientConfigResponse = Static<
	typeof ApplicationClientConfigResponseSchema
>;

/**
 * Dependencies for the applications API.
 */
export interface ApplicationsRoutesDeps {
	readonly applicationRepository: ApplicationRepository;
	readonly applicationClientConfigRepository: ApplicationClientConfigRepository;
	readonly roleRepository: RoleRepository;
	readonly principalRepository: PrincipalRepository;
	readonly oauthClientRepository: OAuthClientRepository;
	readonly encryptionService: EncryptionService;
	readonly createApplicationUseCase: UseCase<
		CreateApplicationCommand,
		ApplicationCreated
	>;
	readonly updateApplicationUseCase: UseCase<
		UpdateApplicationCommand,
		ApplicationUpdated
	>;
	readonly deleteApplicationUseCase: UseCase<
		DeleteApplicationCommand,
		ApplicationDeleted
	>;
	readonly activateApplicationUseCase: UseCase<
		ActivateApplicationCommand,
		ApplicationActivated
	>;
	readonly deactivateApplicationUseCase: UseCase<
		DeactivateApplicationCommand,
		ApplicationDeactivated
	>;
	readonly enableApplicationForClientUseCase: UseCase<
		EnableApplicationForClientCommand,
		ApplicationEnabledForClient
	>;
	readonly disableApplicationForClientUseCase: UseCase<
		DisableApplicationForClientCommand,
		ApplicationDisabledForClient
	>;
	readonly createServiceAccountUseCase: UseCase<
		CreateServiceAccountCommand,
		ServiceAccountCreated
	>;
	readonly attachServiceAccountToApplicationUseCase: UseCase<
		AttachServiceAccountToApplicationCommand,
		ApplicationServiceAccountProvisioned
	>;
	readonly createOAuthClientUseCase: UseCase<
		CreateOAuthClientCommand,
		OAuthClientCreated
	>;
}

/**
 * Register application admin API routes.
 */
export async function registerApplicationsRoutes(
	fastify: FastifyInstance,
	deps: ApplicationsRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		applicationRepository,
		applicationClientConfigRepository,
		roleRepository,
		principalRepository,
		oauthClientRepository,
		encryptionService,
		createApplicationUseCase,
		updateApplicationUseCase,
		deleteApplicationUseCase,
		activateApplicationUseCase,
		deactivateApplicationUseCase,
		enableApplicationForClientUseCase,
		disableApplicationForClientUseCase,
		createServiceAccountUseCase,
		attachServiceAccountToApplicationUseCase,
		createOAuthClientUseCase,
	} = deps;

	async function appHasLoginClient(appId: string): Promise<boolean> {
		const clients = await oauthClientRepository.findByApplication(appId);
		return clients.some(
			(c) =>
				c.serviceAccountPrincipalId === null &&
				c.grantTypes.includes("authorization_code"),
		);
	}

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

	// POST /api/applications/:id/activate - Activate application
	f.post(
		"/applications/:id/activate",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.ACTIVATE),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			const command: ActivateApplicationCommand = {
				applicationId: id,
			};

			const result = await activateApplicationUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const application = await applicationRepository.findById(id);
				if (application) {
					return jsonSuccess(reply, toApplicationResponse(application));
				}
			}

			return sendResult(reply, result);
		},
	);

	// POST /api/applications/:id/deactivate - Deactivate application
	f.post(
		"/applications/:id/deactivate",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.DEACTIVATE),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			const command: DeactivateApplicationCommand = {
				applicationId: id,
			};

			const result = await deactivateApplicationUseCase.execute(command, ctx);

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

	// GET /api/applications/:id/clients - Get client configs for application
	f.get(
		"/applications/:id/clients",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: ApplicationClientConfigsListResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;

			// Verify application exists
			const applicationExists = await applicationRepository.exists(id);
			if (!applicationExists) {
				return notFound(reply, `Application not found: ${id}`);
			}

			const configs =
				await applicationClientConfigRepository.findByApplication(id);

			return jsonSuccess(reply, {
				configs: configs.map(toApplicationClientConfigResponse),
			});
		},
	);

	// POST /api/applications/:id/clients - Enable application for client
	f.post(
		"/applications/:id/clients",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.ENABLE_CLIENT),
			schema: {
				params: IdParam,
				body: ClientIdSchema,
				response: {
					201: ApplicationClientConfigResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as ClientIdBody;
			const ctx = request.executionContext;

			const command: EnableApplicationForClientCommand = {
				applicationId: id,
				clientId: body.clientId,
			};

			const result = await enableApplicationForClientUseCase.execute(
				command,
				ctx,
			);

			if (Result.isSuccess(result)) {
				const config =
					await applicationClientConfigRepository.findByApplicationAndClient(
						id,
						body.clientId,
					);
				if (config) {
					return jsonCreated(reply, toApplicationClientConfigResponse(config));
				}
			}

			return sendResult(reply, result);
		},
	);

	// DELETE /api/applications/:id/clients/:clientId - Disable application for client
	f.delete(
		"/applications/:id/clients/:clientId",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.DISABLE_CLIENT),
			schema: {
				params: IdClientIdParam,
				response: {
					204: Type.Null(),
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id, clientId } = request.params as Static<typeof IdClientIdParam>;
			const ctx = request.executionContext;

			const command: DisableApplicationForClientCommand = {
				applicationId: id,
				clientId,
			};

			const result = await disableApplicationForClientUseCase.execute(
				command,
				ctx,
			);

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

	// POST /api/applications/:id/provision-service-account - Provision service account (Java parity)
	f.post(
		"/applications/:id/provision-service-account",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				body: ProvisionServiceAccountSchema,
				response: {
					201: ProvisionServiceAccountResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as Static<typeof ProvisionServiceAccountSchema>;
			const ctx = request.executionContext;

			const application = await applicationRepository.findById(id);
			if (!application) {
				return notFound(reply, `Application not found: ${id}`);
			}

			// Application already has a service account — return 409 so the
			// caller knows to rotate via the OAuth Clients page rather than
			// silently succeeding with no plaintext to show.
			if (application.serviceAccountId) {
				return jsonError(
					reply,
					409,
					"CONFLICT",
					"Application already has a service account provisioned",
				);
			}

			const command: CreateServiceAccountCommand = {
				code: body.code ?? `${application.code}-service`,
				name: body.name ?? `${application.name} Service Account`,
				description: `Auto-provisioned service account for ${application.name}`,
				applicationId: id,
				clientId: null,
			};

			const result = await createServiceAccountUseCase.execute(command, ctx);

			if (Result.isFailure(result)) {
				return sendResult(reply, result);
			}

			const event = result.value;
			const saData = event.getData();
			const principalId = saData.principalId;

			// Link service account back to the application
			const attachResult =
				await attachServiceAccountToApplicationUseCase.execute(
					{
						applicationId: application.id,
						serviceAccountId: principalId,
						serviceAccountCode: saData.code,
					},
					ctx,
				);
			if (Result.isFailure(attachResult)) {
				return sendResult(reply, attachResult);
			}

			const principal = await principalRepository.findById(principalId);

			return jsonCreated(reply, {
				message: "Service account provisioned",
				serviceAccount: {
					principalId: saData.principalId,
					name: principal?.name ?? saData.name,
					oauthClient: {
						id: saData.oauthClientId,
						clientId: saData.oauthClientPublicId,
						// Plaintext secret is transient on the event — returned to
						// the caller exactly once. Frontend MUST show it now.
						...(event.clientSecret
							? { clientSecret: event.clientSecret }
							: {}),
					},
				},
			});
		},
	);

	// POST /api/applications/:id/provision-login-client - Mint an authorization_code OAuth client
	f.post(
		"/applications/:id/provision-login-client",
		{
			preHandler: requirePermission(APPLICATION_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				body: ProvisionLoginClientRequestSchema,
				response: {
					201: ProvisionLoginClientResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as Static<
				typeof ProvisionLoginClientRequestSchema
			>;
			const ctx = request.executionContext;

			const application = await applicationRepository.findById(id);
			if (!application) {
				return notFound(reply, `Application not found: ${id}`);
			}

			if (body.redirectUris.length === 0) {
				return badRequest(reply, "At least one redirect URI is required");
			}

			if (await appHasLoginClient(application.id)) {
				return jsonError(
					reply,
					409,
					"CONFLICT",
					"Application already has a login OAuth client provisioned",
				);
			}

			const clientType: "PUBLIC" | "CONFIDENTIAL" =
				body.clientType ?? "PUBLIC";

			// CONFIDENTIAL clients get a freshly generated secret. PUBLIC clients
			// use PKCE alone — no secret, no clientSecretRef.
			let clientSecretRef: string | undefined;
			let plaintextSecret: string | undefined;
			if (clientType === "CONFIDENTIAL") {
				const plain = randomBytes(32).toString("base64url");
				const encryptResult = encryptionService.encrypt(plain);
				if (encryptResult.isErr()) {
					throw new Error("Failed to encrypt client secret");
				}
				clientSecretRef = encryptResult.value;
				plaintextSecret = plain;
			}

			const command: CreateOAuthClientCommand = {
				clientName: `${application.name} Login`,
				clientType,
				...(clientSecretRef ? { clientSecretRef } : {}),
				redirectUris: body.redirectUris,
				...(body.allowedOrigins
					? { allowedOrigins: body.allowedOrigins }
					: {}),
				grantTypes: ["authorization_code"],
				defaultScopes: "openid profile email",
				pkceRequired: clientType === "PUBLIC",
				applicationIds: [application.id],
			};

			const result = await createOAuthClientUseCase.execute(command, ctx);
			if (Result.isFailure(result)) {
				return sendResult(reply, result);
			}

			const eventData = result.value.getData();
			const created = await oauthClientRepository.findById(
				eventData.oauthClientId,
			);
			if (!created) {
				throw new Error("OAuth client not found after creation");
			}

			return jsonCreated(reply, {
				message: "Login client provisioned",
				loginClient: {
					clientType,
					redirectUris: [...created.redirectUris],
					oauthClient: {
						id: created.id,
						clientId: created.clientId,
						...(plaintextSecret ? { clientSecret: plaintextSecret } : {}),
					},
				},
			});
		},
	);
}

/**
 * Convert an Application entity to an ApplicationResponse.
 */
function toApplicationResponse(application: {
	id: string;
	type: string;
	code: string;
	name: string;
	description: string | null;
	iconUrl: string | null;
	website: string | null;
	logo: string | null;
	logoMimeType: string | null;
	defaultBaseUrl: string | null;
	serviceAccountId: string | null;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}): ApplicationResponse {
	return {
		id: application.id,
		type: application.type,
		code: application.code,
		name: application.name,
		description: application.description,
		iconUrl: application.iconUrl,
		website: application.website,
		logo: application.logo,
		logoMimeType: application.logoMimeType,
		defaultBaseUrl: application.defaultBaseUrl,
		serviceAccountId: application.serviceAccountId,
		active: application.active,
		createdAt: application.createdAt.toISOString(),
		updatedAt: application.updatedAt.toISOString(),
	};
}

/**
 * Convert an ApplicationClientConfig entity to an ApplicationClientConfigResponse.
 */
function toApplicationClientConfigResponse(config: {
	id: string;
	applicationId: string;
	clientId: string;
	enabled: boolean;
	createdAt: Date;
	updatedAt: Date;
}): ApplicationClientConfigResponse {
	return {
		id: config.id,
		applicationId: config.applicationId,
		clientId: config.clientId,
		enabled: config.enabled,
		createdAt: config.createdAt.toISOString(),
		updatedAt: config.updatedAt.toISOString(),
	};
}
