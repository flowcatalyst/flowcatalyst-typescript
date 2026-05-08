/**
 * WebAuthn HTTP Routes — `/auth/webauthn/*`
 *
 * Six endpoints, mirroring the Rust fc-platform/webauthn/api.rs:
 *   - POST   /auth/webauthn/register/begin       (authenticated)
 *   - POST   /auth/webauthn/register/complete    (authenticated)
 *   - POST   /auth/webauthn/authenticate/begin   (public)
 *   - POST   /auth/webauthn/authenticate/complete (public, sets fc_session)
 *   - GET    /auth/webauthn/credentials          (authenticated)
 *   - DELETE /auth/webauthn/credentials/:id      (authenticated)
 *
 * Per-IP burst limit on /auth/webauthn/* comes from registerAuthIpRateLimit
 * (already wired in plugins.ts at the /auth/ prefix).
 *
 * Per-(email, IP) backoff and per-email lockout are applied at
 * /authenticate/complete via the existing LoginRateLimitService — the
 * same gate /auth/login uses, so attempts across the two paths share
 * the same audit + lockout state.
 */

import { randomBytes } from "node:crypto";
import type {
	FastifyBaseLogger,
	FastifyPluginAsync,
	FastifyRequest,
} from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type, type Static } from "@sinclair/typebox";
import type { PrincipalRepository } from "../persistence/repositories/principal-repository.js";
import type { EmailDomainMappingRepository } from "../persistence/repositories/email-domain-mapping-repository.js";
import type { LoginAttemptRepository } from "../persistence/repositories/login-attempt-repository.js";
import type { WebauthnCredentialRepository } from "../persistence/repositories/webauthn-credential-repository.js";
import type { WebauthnCeremonyRepository } from "../persistence/repositories/webauthn-ceremony-repository.js";
import type { LoginRateLimitService } from "../oidc/login-rate-limit-service.js";
import { getClientIp } from "../oidc/client-ip.js";
import {
	WebauthnService,
	WebauthnVerificationError,
} from "./webauthn-service.js";
import {
	WebauthnDomainFederatedError,
	WebauthnInvalidEmailError,
	ensureInternalAuth,
} from "./webauthn-gate.js";

// ─── Schemas ───────────────────────────────────────────────────────────────

const RegisterBeginRequestSchema = Type.Object({
	displayName: Type.Optional(Type.String({ maxLength: 120 })),
});
const RegisterBeginResponseSchema = Type.Object({
	stateId: Type.String(),
	options: Type.Any(),
});

const RegisterCompleteRequestSchema = Type.Object({
	stateId: Type.String(),
	name: Type.Optional(Type.String({ maxLength: 120 })),
	credential: Type.Any(),
});
const RegisterCompleteResponseSchema = Type.Object({
	credentialId: Type.String(),
});

const AuthenticateBeginRequestSchema = Type.Object({
	email: Type.String({ minLength: 3, maxLength: 320 }),
});
const AuthenticateBeginResponseSchema = Type.Object({
	stateId: Type.String(),
	options: Type.Any(),
});

const AuthenticateCompleteRequestSchema = Type.Object({
	stateId: Type.String(),
	credential: Type.Any(),
});
const AuthenticateCompleteResponseSchema = Type.Object({
	principalId: Type.String(),
	email: Type.Union([Type.String(), Type.Null()]),
	name: Type.String(),
	roles: Type.Array(Type.String()),
});

const CredentialSummarySchema = Type.Object({
	id: Type.String(),
	name: Type.Union([Type.String(), Type.Null()]),
	createdAt: Type.String({ format: "date-time" }),
	lastUsedAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
});

const ErrorResponseSchema = Type.Object({
	code: Type.String(),
	message: Type.String(),
});

const InvalidCredentialsResponseSchema = Type.Object({
	error: Type.Literal("INVALID_CREDENTIALS"),
	message: Type.String(),
});

// ─── Deps ───────────────────────────────────────────────────────────────

export interface WebauthnRoutesDeps {
	readonly principalRepository: PrincipalRepository;
	readonly emailDomainMappingRepository: EmailDomainMappingRepository;
	readonly loginAttemptRepository: LoginAttemptRepository;
	readonly webauthnCredentialRepository: WebauthnCredentialRepository;
	readonly webauthnCeremonyRepository: WebauthnCeremonyRepository;
	readonly webauthnService: WebauthnService;
	readonly loginRateLimitService?: LoginRateLimitService;
	readonly issueSessionToken: (
		principalId: string,
		email: string,
		roles: string[],
		clients: string[],
	) => Promise<string>;
	readonly cookieConfig: {
		readonly name: string;
		readonly secure: boolean;
		readonly sameSite: "strict" | "lax" | "none";
		readonly maxAge: number;
	};
	readonly trustedProxyHops: number;
	readonly logger: FastifyBaseLogger;
	/** Authenticated principal extractor — same plumbing /auth/me uses. */
	readonly resolvePrincipalFromRequest: (
		request: FastifyRequest,
	) => Promise<{ id: string; name: string; email: string | null } | null>;
}

// ─── Plugin ─────────────────────────────────────────────────────────────

export const registerWebauthnRoutes: FastifyPluginAsync<
	WebauthnRoutesDeps
> = async (fastify, deps) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const log = deps.logger.child({ component: "WebauthnRoutes" });

	function recordAttempt(input: {
		outcome: "SUCCESS" | "FAILURE";
		failureReason?: string;
		identifier: string | null;
		principalId: string | null;
		ip: string | null;
		userAgent: string | null;
	}): void {
		void deps.loginAttemptRepository
			.create({
				attemptType: "WEBAUTHN_LOGIN",
				outcome: input.outcome,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				failureReason: (input.failureReason as any) ?? null,
				identifier: input.identifier ?? "",
				principalId: input.principalId ?? null,
				ipAddress: input.ip ?? null,
				userAgent: input.userAgent ?? null,
				attemptedAt: new Date(),
			})
			.catch((err) => log.warn({ err }, "failed to record webauthn attempt"));
	}

	function ipOf(request: FastifyRequest): string | null {
		return getClientIp(request, { trustedHops: deps.trustedProxyHops });
	}

	function uaOf(request: FastifyRequest): string | null {
		const ua = request.headers["user-agent"];
		return Array.isArray(ua) ? (ua[0] ?? null) : (ua ?? null);
	}

	// Generic INVALID_CREDENTIALS for the public auth endpoint. All
	// failure modes return this exact body so an attacker can't tell
	// state-not-found from bad-assertion from federated-domain.
	function invalidCredentialsResponse() {
		return {
			error: "INVALID_CREDENTIALS" as const,
			message: "passkey authentication failed",
		};
	}

	// ── POST /auth/webauthn/register/begin ────────────────────────────
	f.post(
		"/auth/webauthn/register/begin",
		{
			schema: {
				body: RegisterBeginRequestSchema,
				response: {
					200: RegisterBeginResponseSchema,
					400: ErrorResponseSchema,
					401: ErrorResponseSchema,
				},
				tags: ["WebAuthn"],
			},
		},
		async (request, reply) => {
			const principal = await deps.resolvePrincipalFromRequest(request);
			if (!principal) {
				reply.code(401);
				return { code: "UNAUTHORIZED", message: "authentication required" };
			}
			if (!principal.email) {
				reply.code(400);
				return { code: "NO_EMAIL", message: "session has no email" };
			}
			try {
				await ensureInternalAuth(
					principal.email,
					deps.emailDomainMappingRepository,
				);
			} catch (err) {
				if (
					err instanceof WebauthnDomainFederatedError ||
					err instanceof WebauthnInvalidEmailError
				) {
					reply.code(400);
					return { code: "DOMAIN_FEDERATED", message: err.message };
				}
				throw err;
			}

			const existing =
				await deps.webauthnCredentialRepository.findByPrincipal(principal.id);
			const exclude = existing.map((c) => c.credentialIdBytes);

			const requestBody = request.body as Static<
				typeof RegisterBeginRequestSchema
			>;
			const displayName = requestBody.displayName ?? principal.name;
			const options = await deps.webauthnService.generateRegistration({
				principalId: principal.id,
				userName: principal.email,
				userDisplayName: displayName,
				excludeCredentials: exclude,
			});

			const stateId = randomBytes(16).toString("hex");
			await deps.webauthnCeremonyRepository.storeRegistration({
				stateId,
				principalId: principal.id,
				challenge: options.challenge,
				displayName,
			});

			return { stateId, options };
		},
	);

	// ── POST /auth/webauthn/register/complete ─────────────────────────
	f.post(
		"/auth/webauthn/register/complete",
		{
			schema: {
				body: RegisterCompleteRequestSchema,
				response: {
					200: RegisterCompleteResponseSchema,
					400: ErrorResponseSchema,
					401: ErrorResponseSchema,
					403: ErrorResponseSchema,
				},
				tags: ["WebAuthn"],
			},
		},
		async (request, reply) => {
			const principal = await deps.resolvePrincipalFromRequest(request);
			if (!principal) {
				reply.code(401);
				return { code: "UNAUTHORIZED", message: "authentication required" };
			}

			const body = request.body as Static<typeof RegisterCompleteRequestSchema>;
			const consumed =
				await deps.webauthnCeremonyRepository.consumeRegistration(body.stateId);
			if (!consumed) {
				reply.code(400);
				return {
					code: "CEREMONY_EXPIRED",
					message: "registration ceremony state not found or expired",
				};
			}
			if (consumed.principalId !== principal.id) {
				reply.code(403);
				return {
					code: "CEREMONY_OWNER_MISMATCH",
					message: "ceremony belongs to a different principal",
				};
			}

			let verified;
			try {
				verified = await deps.webauthnService.verifyRegistration({
					response: body.credential,
					expectedChallenge: consumed.challenge,
				});
			} catch (err) {
				log.warn({ err }, "webauthn registration verification failed");
				reply.code(400);
				return {
					code: "ATTESTATION_INVALID",
					message: "passkey attestation could not be verified",
				};
			}

			const persisted = await deps.webauthnCredentialRepository.persist({
				principalId: principal.id,
				credentialIdBytes: verified.credentialIdBytes,
				data: verified.data,
				name: body.name?.trim() || null,
			});
			return { credentialId: persisted.id };
		},
	);

	// ── POST /auth/webauthn/authenticate/begin ────────────────────────
	f.post(
		"/auth/webauthn/authenticate/begin",
		{
			schema: {
				body: AuthenticateBeginRequestSchema,
				response: { 200: AuthenticateBeginResponseSchema },
				tags: ["WebAuthn"],
			},
		},
		async (request) => {
			const body = request.body as Static<typeof AuthenticateBeginRequestSchema>;
			const email = body.email.toLowerCase();

			// Match-Rust enumeration defense. Same response shape regardless
			// of whether the email is real, federated, or has no credentials.
			const real = await loadRealCredentials();
			if (real && real.length > 0) {
				const allowIds = real.map((c) => c.credentialIdBytes);
				const transportsByCredentialId = new Map<string, readonly string[]>();
				for (const c of real) {
					if (c.data.transports?.length) {
						transportsByCredentialId.set(c.data.credentialID, c.data.transports);
					}
				}
				const options = await deps.webauthnService.generateAuthentication({
					allowCredentials: allowIds,
					transportsByCredentialId,
				});
				const stateId = randomBytes(16).toString("hex");
				await deps.webauthnCeremonyRepository.storeAuthentication({
					stateId,
					principalId: real[0]!.principalId,
					challenge: options.challenge,
					allowCredentials: real.map((c) => c.data.credentialID),
				});
				return { stateId, options };
			}

			// No real state stored — /complete will see "state not found"
			// and return the same INVALID_CREDENTIALS as a failed assertion.
			const stateId = randomBytes(16).toString("hex");
			const options =
				await deps.webauthnService.generateFakeAuthentication(email);
			return { stateId, options };

			async function loadRealCredentials() {
				try {
					await ensureInternalAuth(
						email,
						deps.emailDomainMappingRepository,
					);
				} catch {
					return null;
				}
				const principal =
					await deps.principalRepository.findByEmail(email);
				if (!principal || !principal.active) return null;
				const creds =
					await deps.webauthnCredentialRepository.findByPrincipal(principal.id);
				return creds.length > 0 ? creds : null;
			}
		},
	);

	// ── POST /auth/webauthn/authenticate/complete ─────────────────────
	f.post(
		"/auth/webauthn/authenticate/complete",
		{
			schema: {
				body: AuthenticateCompleteRequestSchema,
				response: {
					200: AuthenticateCompleteResponseSchema,
					401: InvalidCredentialsResponseSchema,
					429: ErrorResponseSchema,
				},
				tags: ["WebAuthn"],
			},
		},
		async (request, reply) => {
			const body = request.body as Static<
				typeof AuthenticateCompleteRequestSchema
			>;
			const ip = ipOf(request);
			const userAgent = uaOf(request);

			const consumed =
				await deps.webauthnCeremonyRepository.consumeAuthentication(body.stateId);
			if (!consumed) {
				recordAttempt({
					outcome: "FAILURE",
					failureReason: "CEREMONY_EXPIRED",
					identifier: null,
					principalId: null,
					ip,
					userAgent,
				});
				reply.code(401);
				return invalidCredentialsResponse();
			}

			// Resolve credential from response.id (base64url credential ID).
			const responseAny = body.credential as { id?: string };
			const credIdB64 = typeof responseAny.id === "string" ? responseAny.id : "";
			if (!credIdB64) {
				recordAttempt({
					outcome: "FAILURE",
					failureReason: "RESPONSE_MISSING_ID",
					identifier: null,
					principalId: null,
					ip,
					userAgent,
				});
				reply.code(401);
				return invalidCredentialsResponse();
			}
			const credIdBytes = base64UrlToBytes(credIdB64);

			const credential =
				await deps.webauthnCredentialRepository.findByCredentialId(credIdBytes);
			if (!credential) {
				recordAttempt({
					outcome: "FAILURE",
					failureReason: "CREDENTIAL_NOT_FOUND",
					identifier: null,
					principalId: null,
					ip,
					userAgent,
				});
				reply.code(401);
				return invalidCredentialsResponse();
			}

			const principal = await deps.principalRepository.findById(
				credential.principalId,
			);
			if (!principal || !principal.active) {
				recordAttempt({
					outcome: "FAILURE",
					failureReason: principal ? "ACCOUNT_INACTIVE" : "PRINCIPAL_NOT_FOUND",
					identifier: principal?.userIdentity?.email ?? null,
					principalId: credential.principalId,
					ip,
					userAgent,
				});
				reply.code(401);
				return invalidCredentialsResponse();
			}

			const email = principal.userIdentity?.email ?? null;

			// Hard-recheck the federation gate at auth time. A domain that
			// becomes federated after credentials were registered must NOT
			// be honoured — IdP owns identity from this point.
			if (email) {
				try {
					await ensureInternalAuth(email, deps.emailDomainMappingRepository);
				} catch {
					recordAttempt({
						outcome: "FAILURE",
						failureReason: "DOMAIN_FEDERATED",
						identifier: email,
						principalId: principal.id,
						ip,
						userAgent,
					});
					reply.code(401);
					return invalidCredentialsResponse();
				}
			}

			// Apply the SAME backoff/lockout gate as /auth/login. Belt-and-
			// braces: passkeys are infeasible to brute-force, but locking
			// the email across both paths closes any fallback-flow gap.
			if (email && deps.loginRateLimitService) {
				const decision = await deps.loginRateLimitService.check(
					email,
					ip,
					/*isFederated*/ false,
				);
				if (!decision.allowed) {
					recordAttempt({
						outcome: "FAILURE",
						failureReason:
							decision.reason === "LOCKED" ? "ACCOUNT_LOCKED" : "RATE_LIMITED",
						identifier: email,
						principalId: principal.id,
						ip,
						userAgent,
					});
					reply.header("Retry-After", String(decision.retryAfterSeconds));
					reply.code(429);
					return {
						code: "RATE_LIMITED",
						message: "Too many attempts. Try again later.",
					};
				}
			}

			let verified;
			try {
				verified = await deps.webauthnService.verifyAuthentication({
					response: body.credential,
					expectedChallenge: consumed.challenge,
					credential: credential.data,
				});
			} catch (err) {
				if (err instanceof WebauthnVerificationError) {
					recordAttempt({
						outcome: "FAILURE",
						failureReason: "ASSERTION_INVALID",
						identifier: email,
						principalId: principal.id,
						ip,
						userAgent,
					});
					reply.code(401);
					return invalidCredentialsResponse();
				}
				log.error({ err }, "webauthn authentication unexpected failure");
				reply.code(401);
				return invalidCredentialsResponse();
			}

			await deps.webauthnCredentialRepository.updateUsage(
				credential.id,
				verified.data,
				new Date(),
			);

			const roles = principal.roles.map((r) => r.roleName);
			const clients: string[] = [];
			const token = await deps.issueSessionToken(
				principal.id,
				email ?? "",
				roles,
				clients,
			);
			reply.setCookie(deps.cookieConfig.name, token, {
				path: "/",
				httpOnly: true,
				secure: deps.cookieConfig.secure,
				sameSite: deps.cookieConfig.sameSite,
				maxAge: deps.cookieConfig.maxAge,
			});

			recordAttempt({
				outcome: "SUCCESS",
				identifier: email,
				principalId: principal.id,
				ip,
				userAgent,
			});

			return {
				principalId: principal.id,
				email,
				name: principal.name,
				roles,
			};
		},
	);

	// ── GET /auth/webauthn/credentials ────────────────────────────────
	f.get(
		"/auth/webauthn/credentials",
		{
			schema: {
				response: {
					200: Type.Array(CredentialSummarySchema),
					401: ErrorResponseSchema,
				},
				tags: ["WebAuthn"],
			},
		},
		async (request, reply) => {
			const principal = await deps.resolvePrincipalFromRequest(request);
			if (!principal) {
				reply.code(401);
				return { code: "UNAUTHORIZED", message: "authentication required" };
			}
			const creds = await deps.webauthnCredentialRepository.findByPrincipal(
				principal.id,
			);
			return creds.map((c) => ({
				id: c.id,
				name: c.name,
				createdAt: c.createdAt.toISOString(),
				lastUsedAt: c.lastUsedAt ? c.lastUsedAt.toISOString() : null,
			}));
		},
	);

	// ── DELETE /auth/webauthn/credentials/:id ─────────────────────────
	f.delete<{ Params: { id: string } }>(
		"/auth/webauthn/credentials/:id",
		{
			schema: {
				params: Type.Object({ id: Type.String() }),
				response: {
					204: Type.Null(),
					401: ErrorResponseSchema,
					404: ErrorResponseSchema,
				},
				tags: ["WebAuthn"],
			},
		},
		async (request, reply) => {
			const principal = await deps.resolvePrincipalFromRequest(request);
			if (!principal) {
				reply.code(401);
				return { code: "UNAUTHORIZED", message: "authentication required" };
			}
			const removed =
				await deps.webauthnCredentialRepository.deleteByIdForPrincipal(
					request.params.id,
					principal.id,
				);
			if (!removed) {
				reply.code(404);
				return {
					code: "NOT_FOUND",
					message: "credential not found or not owned by caller",
				};
			}
			reply.code(204);
			return null;
		},
	);
};

function base64UrlToBytes(b64url: string): Uint8Array {
	const padded = b64url.replace(/-/g, "+").replace(/_/g, "/");
	const padding =
		padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
	return new Uint8Array(Buffer.from(padded + padding, "base64"));
}
