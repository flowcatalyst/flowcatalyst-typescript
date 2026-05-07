/**
 * OAuth Clients Admin API
 *
 * REST endpoints for OAuth client management.
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
	MessageResponseSchema,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";
import type { UseCase } from "@flowcatalyst/application";
import type { EncryptionService } from "@flowcatalyst/platform-crypto";
import { randomBytes } from "node:crypto";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type {
	CreateOAuthClientCommand,
	UpdateOAuthClientCommand,
	RegenerateOAuthClientSecretCommand,
	DeleteOAuthClientCommand,
	ActivateOAuthClientCommand,
	DeactivateOAuthClientCommand,
} from "../../application/index.js";
import type {
	OAuthClientCreated,
	OAuthClientUpdated,
	OAuthClientSecretRegenerated,
	OAuthClientDeleted,
	OAuthClientActivated,
	OAuthClientDeactivated,
	OAuthClient,
} from "../../domain/index.js";
import type {
	OAuthClientRepository,
	ApplicationRepository,
} from "../../infrastructure/persistence/index.js";
import { requirePermission } from "../../authorization/index.js";
import { OAUTH_CLIENT_PERMISSIONS } from "../../authorization/permissions/platform-auth.js";
import { invalidateOidcClientCache } from "../../infrastructure/oidc/index.js";

// ─── Request Schemas ────────────────────────────────────────────────────────

const OAuthClientTypeSchema = Type.Union([
	Type.Literal("PUBLIC"),
	Type.Literal("CONFIDENTIAL"),
]);

const OAuthGrantTypeSchema = Type.Union([
	Type.Literal("authorization_code"),
	Type.Literal("client_credentials"),
	Type.Literal("refresh_token"),
	Type.Literal("password"),
]);

const DefaultScopesSchema = Type.Union([
	Type.Array(Type.String()),
	Type.String(),
	Type.Null(),
]);

const CreateOAuthClientSchema = Type.Object({
	clientName: Type.String({ minLength: 1 }),
	clientType: OAuthClientTypeSchema,
	clientSecretRef: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	redirectUris: Type.Optional(Type.Array(Type.String())),
	allowedOrigins: Type.Optional(Type.Array(Type.String())),
	grantTypes: Type.Optional(Type.Array(OAuthGrantTypeSchema)),
	defaultScopes: Type.Optional(DefaultScopesSchema),
	pkceRequired: Type.Optional(Type.Boolean()),
	applicationIds: Type.Optional(Type.Array(Type.String())),
});

const UpdateOAuthClientSchema = Type.Object({
	clientName: Type.Optional(Type.String({ minLength: 1 })),
	redirectUris: Type.Optional(Type.Array(Type.String())),
	allowedOrigins: Type.Optional(Type.Array(Type.String())),
	grantTypes: Type.Optional(Type.Array(OAuthGrantTypeSchema)),
	defaultScopes: Type.Optional(DefaultScopesSchema),
	pkceRequired: Type.Optional(Type.Boolean()),
	applicationIds: Type.Optional(Type.Array(Type.String())),
	active: Type.Optional(Type.Boolean()),
});

const IdParam = Type.Object({ id: Type.String() });
const ClientIdParam = Type.Object({ clientId: Type.String() });

const ListOAuthClientsQuery = Type.Object({
	active: Type.Optional(Type.String()),
});

type CreateOAuthClientBody = Static<typeof CreateOAuthClientSchema>;
type UpdateOAuthClientBody = Static<typeof UpdateOAuthClientSchema>;

/** Normalize defaultScopes input to a space-separated string for storage. */
function normalizeScopes(
	scopes: string[] | string | null | undefined,
): string | null | undefined {
	if (scopes === undefined) return undefined;
	if (scopes === null) return null;
	if (Array.isArray(scopes)) return scopes.join(" ") || null;
	return scopes; // single string like "openid" or "openid profile" passes through
}

// ─── Response Schemas ───────────────────────────────────────────────────────

const ApplicationRefSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
});

const OAuthClientResponseSchema = Type.Object({
	id: Type.String(),
	clientId: Type.String(),
	clientName: Type.String(),
	clientType: Type.String(),
	hasClientSecret: Type.Boolean(),
	redirectUris: Type.Array(Type.String()),
	allowedOrigins: Type.Array(Type.String()),
	grantTypes: Type.Array(Type.String()),
	defaultScopes: Type.Array(Type.String()),
	pkceRequired: Type.Boolean(),
	applicationIds: Type.Array(Type.String()),
	applications: Type.Array(ApplicationRefSchema),
	serviceAccountPrincipalId: Type.Union([Type.String(), Type.Null()]),
	active: Type.Boolean(),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});

const OAuthClientListResponseSchema = Type.Object({
	clients: Type.Array(OAuthClientResponseSchema),
	total: Type.Integer(),
});

const RegenerateSecretResponseSchema = Type.Object({
	client: OAuthClientResponseSchema,
	clientSecret: Type.String({
		description: "The plaintext client secret (shown only once)",
	}),
});

const CreateOAuthClientResponseSchema = Type.Object({
	client: OAuthClientResponseSchema,
	clientSecret: Type.Optional(
		Type.String({
			description:
				"Auto-generated plaintext client secret for CONFIDENTIAL clients (shown only once)",
		}),
	),
});

type OAuthClientResponse = Static<typeof OAuthClientResponseSchema>;

/**
 * Dependencies for the OAuth clients API.
 */
export interface OAuthClientsRoutesDeps {
	readonly oauthClientRepository: OAuthClientRepository;
	readonly applicationRepository: ApplicationRepository;
	readonly encryptionService: EncryptionService;
	readonly db: PostgresJsDatabase;
	readonly createOAuthClientUseCase: UseCase<
		CreateOAuthClientCommand,
		OAuthClientCreated
	>;
	readonly updateOAuthClientUseCase: UseCase<
		UpdateOAuthClientCommand,
		OAuthClientUpdated
	>;
	readonly regenerateOAuthClientSecretUseCase: UseCase<
		RegenerateOAuthClientSecretCommand,
		OAuthClientSecretRegenerated
	>;
	readonly deleteOAuthClientUseCase: UseCase<
		DeleteOAuthClientCommand,
		OAuthClientDeleted
	>;
	readonly activateOAuthClientUseCase: UseCase<
		ActivateOAuthClientCommand,
		OAuthClientActivated
	>;
	readonly deactivateOAuthClientUseCase: UseCase<
		DeactivateOAuthClientCommand,
		OAuthClientDeactivated
	>;
}

/**
 * Convert OAuthClient to response.
 * @param appMap - Map of application ID -> name for resolving references
 */
function toResponse(
	client: OAuthClient,
	appMap: Map<string, string>,
): OAuthClientResponse {
	return {
		id: client.id,
		clientId: client.clientId,
		clientName: client.clientName,
		clientType: client.clientType,
		hasClientSecret: Boolean(client.clientSecretRef),
		redirectUris: [...client.redirectUris],
		allowedOrigins: [...client.allowedOrigins],
		grantTypes: [...client.grantTypes],
		defaultScopes: client.defaultScopes
			? client.defaultScopes.split(/[,\s]+/).filter(Boolean)
			: [],
		pkceRequired: client.pkceRequired,
		applicationIds: [...client.applicationIds],
		applications: client.applicationIds
			.map((id) => {
				const name = appMap.get(id);
				return name ? { id, name } : null;
			})
			.filter((a): a is { id: string; name: string } => a !== null),
		serviceAccountPrincipalId: client.serviceAccountPrincipalId,
		active: client.active,
		createdAt: client.createdAt.toISOString(),
		updatedAt: client.updatedAt.toISOString(),
	};
}

/**
 * Register OAuth client admin API routes.
 */
export async function registerOAuthClientsRoutes(
	fastify: FastifyInstance,
	deps: OAuthClientsRoutesDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		oauthClientRepository,
		applicationRepository,
		encryptionService,
		db,
		createOAuthClientUseCase,
		updateOAuthClientUseCase,
		regenerateOAuthClientSecretUseCase,
		deleteOAuthClientUseCase,
		activateOAuthClientUseCase,
		deactivateOAuthClientUseCase,
	} = deps;

	/**
	 * Build a Map of application ID -> name for resolving references.
	 */
	async function buildAppMap(): Promise<Map<string, string>> {
		const apps = await applicationRepository.findAll();
		return new Map(apps.map((a) => [a.id, a.name]));
	}

	// GET /api/oauth-clients - List all OAuth clients
	f.get(
		"/oauth-clients",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.READ),
			schema: {
				querystring: ListOAuthClientsQuery,
				response: {
					200: OAuthClientListResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const query = request.query as Static<typeof ListOAuthClientsQuery>;

			const [clients, appMap] = await Promise.all([
				query.active === "true"
					? oauthClientRepository.findActive()
					: oauthClientRepository.findAll(),
				buildAppMap(),
			]);

			return jsonSuccess(reply, {
				clients: clients.map((c) => toResponse(c, appMap)),
				total: clients.length,
			});
		},
	);

	// GET /api/oauth-clients/:id - Get OAuth client by ID
	f.get(
		"/oauth-clients/:id",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.READ),
			schema: {
				params: IdParam,
				response: {
					200: OAuthClientResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const client = await oauthClientRepository.findById(id);

			if (!client) {
				return notFound(reply, `OAuth client not found: ${id}`);
			}

			const appMap = await buildAppMap();
			return jsonSuccess(reply, toResponse(client, appMap));
		},
	);

	// GET /api/oauth-clients/by-client-id/:clientId - Get OAuth client by clientId
	f.get(
		"/oauth-clients/by-client-id/:clientId",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.READ),
			schema: {
				params: ClientIdParam,
				response: {
					200: OAuthClientResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { clientId } = request.params as Static<typeof ClientIdParam>;
			const client = await oauthClientRepository.findByClientId(clientId);

			if (!client) {
				return notFound(reply, `OAuth client not found: ${clientId}`);
			}

			const appMap = await buildAppMap();
			return jsonSuccess(reply, toResponse(client, appMap));
		},
	);

	// POST /api/oauth-clients - Create OAuth client
	f.post(
		"/oauth-clients",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.CREATE),
			schema: {
				body: CreateOAuthClientSchema,
				response: {
					201: CreateOAuthClientResponseSchema,
					400: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const body = request.body as CreateOAuthClientBody;
			const ctx = request.executionContext;

			// For CONFIDENTIAL clients, auto-generate a secret if one isn't provided.
			// The plaintext is returned once in the response; only the encrypted ref is stored.
			let clientSecretRef: string | null | undefined = body.clientSecretRef;
			let generatedSecret: string | undefined;
			if (body.clientType === "CONFIDENTIAL" && !clientSecretRef) {
				const plainSecret = randomBytes(32).toString("base64url");
				const encryptResult = encryptionService.encrypt(plainSecret);
				if (encryptResult.isErr()) {
					throw new Error("Failed to encrypt client secret");
				}
				clientSecretRef = encryptResult.value;
				generatedSecret = plainSecret;
			}

			const command: CreateOAuthClientCommand = {
				clientName: body.clientName,
				clientType: body.clientType,
				clientSecretRef,
				redirectUris: body.redirectUris,
				allowedOrigins: body.allowedOrigins,
				grantTypes: body.grantTypes,
				defaultScopes: normalizeScopes(body.defaultScopes),
				pkceRequired: body.pkceRequired,
				applicationIds: body.applicationIds,
			};

			const result = await createOAuthClientUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const client = await oauthClientRepository.findById(
					result.value.getData().oauthClientId,
				);
				if (client) {
					const appMap = await buildAppMap();
					return jsonCreated(reply, {
						client: toResponse(client, appMap),
						...(generatedSecret ? { clientSecret: generatedSecret } : {}),
					});
				}
			}

			return sendResult(reply, result);
		},
	);

	// PUT /api/oauth-clients/:id - Update OAuth client
	f.put(
		"/oauth-clients/:id",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				body: UpdateOAuthClientSchema,
				response: {
					200: OAuthClientResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
					409: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const body = request.body as UpdateOAuthClientBody;
			const ctx = request.executionContext;

			const command: UpdateOAuthClientCommand = {
				oauthClientId: id,
				clientName: body.clientName,
				redirectUris: body.redirectUris,
				allowedOrigins: body.allowedOrigins,
				grantTypes: body.grantTypes,
				defaultScopes: normalizeScopes(body.defaultScopes),
				pkceRequired: body.pkceRequired,
				applicationIds: body.applicationIds,
				active: body.active,
			};

			const result = await updateOAuthClientUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				const client = await oauthClientRepository.findById(id);
				if (client) {
					// Invalidate cached OIDC client metadata so oidc-provider picks up changes
					await invalidateOidcClientCache(db, client.clientId);
					const appMap = await buildAppMap();
					return jsonSuccess(reply, toResponse(client, appMap));
				}
			}

			return sendResult(reply, result);
		},
	);

	// POST /api/oauth-clients/:id/regenerate-secret - Regenerate client secret
	f.post(
		"/oauth-clients/:id/regenerate-secret",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.REGENERATE_SECRET),
			schema: {
				params: IdParam,
				response: {
					200: RegenerateSecretResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			// Generate a random secret and encrypt it for storage
			const plainSecret = randomBytes(32).toString("base64url");
			const encryptResult = encryptionService.encrypt(plainSecret);
			if (encryptResult.isErr()) {
				throw new Error("Failed to encrypt client secret");
			}

			const command: RegenerateOAuthClientSecretCommand = {
				oauthClientId: id,
				newSecretRef: encryptResult.value,
			};

			const result = await regenerateOAuthClientSecretUseCase.execute(
				command,
				ctx,
			);

			if (Result.isSuccess(result)) {
				const client = await oauthClientRepository.findById(id);
				if (client) {
					// Invalidate cached OIDC client metadata so oidc-provider picks up the new secret
					await invalidateOidcClientCache(db, client.clientId);
					const appMap = await buildAppMap();
					return jsonSuccess(reply, {
						client: toResponse(client, appMap),
						clientSecret: plainSecret,
					});
				}
			}

			return sendResult(reply, result);
		},
	);

	// POST /api/oauth-clients/:id/activate - Activate OAuth client
	f.post(
		"/oauth-clients/:id/activate",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				response: {
					200: MessageResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;
			const result = await activateOAuthClientUseCase.execute(
				{ oauthClientId: id },
				ctx,
			);
			if (Result.isFailure(result)) return sendResult(reply, result);
			return jsonSuccess(reply, { message: "OAuth client activated" });
		},
	);

	// POST /api/oauth-clients/:id/deactivate - Deactivate OAuth client
	f.post(
		"/oauth-clients/:id/deactivate",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.UPDATE),
			schema: {
				params: IdParam,
				response: {
					200: MessageResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;
			const result = await deactivateOAuthClientUseCase.execute(
				{ oauthClientId: id },
				ctx,
			);
			if (Result.isFailure(result)) return sendResult(reply, result);
			return jsonSuccess(reply, { message: "OAuth client deactivated" });
		},
	);

	// POST /api/oauth-clients/:id/rotate-secret - Alias for regenerate-secret
	f.post(
		"/oauth-clients/:id/rotate-secret",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.REGENERATE_SECRET),
			schema: {
				params: IdParam,
				response: {
					200: RegenerateSecretResponseSchema,
					400: ErrorResponseSchema,
					404: ErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params as Static<typeof IdParam>;
			const ctx = request.executionContext;

			// Generate a random secret and encrypt it for storage
			const plainSecret = randomBytes(32).toString("base64url");
			const encryptResult = encryptionService.encrypt(plainSecret);
			if (encryptResult.isErr()) {
				throw new Error("Failed to encrypt client secret");
			}

			const command: RegenerateOAuthClientSecretCommand = {
				oauthClientId: id,
				newSecretRef: encryptResult.value,
			};

			const result = await regenerateOAuthClientSecretUseCase.execute(
				command,
				ctx,
			);

			if (Result.isSuccess(result)) {
				const client = await oauthClientRepository.findById(id);
				if (client) {
					// Invalidate cached OIDC client metadata so oidc-provider picks up the new secret
					await invalidateOidcClientCache(db, client.clientId);
					const appMap = await buildAppMap();
					return jsonSuccess(reply, {
						client: toResponse(client, appMap),
						clientSecret: plainSecret,
					});
				}
			}

			return sendResult(reply, result);
		},
	);

	// DELETE /api/oauth-clients/:id - Delete OAuth client
	f.delete(
		"/oauth-clients/:id",
		{
			preHandler: requirePermission(OAUTH_CLIENT_PERMISSIONS.DELETE),
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

			const command: DeleteOAuthClientCommand = {
				oauthClientId: id,
			};

			const result = await deleteOAuthClientUseCase.execute(command, ctx);

			if (Result.isSuccess(result)) {
				return noContent(reply);
			}

			return sendResult(reply, result);
		},
	);
}
