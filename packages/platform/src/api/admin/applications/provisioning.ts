/**
 * Applications admin API — provisioning routes.
 *
 *   POST /applications/:id/provision-service-account
 *   POST /applications/:id/provision-login-client
 *
 * Also exports `appHasLoginClient` — the CRUD route uses it for the
 * detail-GET `hasLoginClient` flag, so it lives here next to its
 * other caller.
 */

import { randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { Static } from "@sinclair/typebox";
import {
	ErrorResponseSchema,
	badRequest,
	jsonCreated,
	jsonError,
	notFound,
	sendResult,
} from "@flowcatalyst/http";
import { Result } from "@flowcatalyst/application";

import type {
	CreateOAuthClientCommand,
	CreateServiceAccountCommand,
} from "../../../application/index.js";
import { requirePermission } from "../../../authorization/index.js";
import { APPLICATION_PERMISSIONS } from "../../../authorization/permissions/platform-admin.js";

import type { ApplicationsRoutesDeps } from "./index.js";
import {
	IdParam,
	ProvisionLoginClientRequestSchema,
	ProvisionLoginClientResponseSchema,
	ProvisionServiceAccountResponseSchema,
	ProvisionServiceAccountSchema,
} from "./schemas.js";

export type AppHasLoginClientFn = (appId: string) => Promise<boolean>;

/**
 * Build the shared `appHasLoginClient` query used by both the CRUD
 * detail-GET (for the `hasLoginClient` flag) and the provisioning
 * login-client route (for the conflict pre-check).
 */
export function makeAppHasLoginClient(
	deps: Pick<ApplicationsRoutesDeps, "oauthClientRepository">,
): AppHasLoginClientFn {
	return async (appId) => {
		const clients = await deps.oauthClientRepository.findByApplication(appId);
		return clients.some(
			(c) =>
				c.serviceAccountPrincipalId === null &&
				c.grantTypes.includes("authorization_code"),
		);
	};
}

export async function registerProvisioningRoutes(
	fastify: FastifyInstance,
	deps: ApplicationsRoutesDeps,
	appHasLoginClient: AppHasLoginClientFn,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const {
		applicationRepository,
		principalRepository,
		oauthClientRepository,
		encryptionService,
		createServiceAccountUseCase,
		attachServiceAccountToApplicationUseCase,
		createOAuthClientUseCase,
	} = deps;

	// POST /api/applications/:id/provision-service-account (Java parity)
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

			const clientType: "PUBLIC" | "CONFIDENTIAL" = body.clientType ?? "PUBLIC";

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
