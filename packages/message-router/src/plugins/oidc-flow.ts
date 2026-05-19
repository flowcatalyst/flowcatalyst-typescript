/**
 * OIDC Authorization Code Flow
 *
 * Browser-based login for interactive users. Bearer-token validation
 * for machine clients lives in `auth-plugin.ts`; this plugin adds the
 * three redirect endpoints (`/auth/login`, `/auth/callback`,
 * `/auth/logout`) plus the in-memory session and pending-state stores
 * that back them. Mirrors the Rust `crates/fc-router/src/api/oidc_flow.rs`.
 */

import { createHash, randomBytes } from "node:crypto";
import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import * as jose from "jose";
import type { Logger } from "@flowcatalyst/logging";
import type { AuthUser } from "./auth-plugin.js";

// ── Types ──

export interface OidcFlowConfig {
	issuerUrl: string;
	clientId: string;
	clientSecret?: string | undefined;
	redirectUri: string;
	scopes: string[];
	sessionTtlSeconds: number;
	audience?: string | undefined;
}

interface SessionData {
	user: AuthUser;
	createdAtMs: number;
}

interface PendingState {
	pkceVerifier: string;
	nonce: string;
	originalUrl: string;
	createdAtMs: number;
}

// ── Stores ──

/**
 * In-memory session store keyed by random session id. Sessions expire
 * after `ttlSeconds`; `get` is lazy (TTL-checked at read time) and
 * `cleanup` removes the long tail.
 */
export class SessionStore {
	private readonly sessions = new Map<string, SessionData>();
	private readonly ttlMs: number;

	constructor(ttlSeconds: number) {
		this.ttlMs = ttlSeconds * 1000;
	}

	insert(sessionId: string, user: AuthUser): void {
		this.sessions.set(sessionId, { user, createdAtMs: Date.now() });
	}

	get(sessionId: string): AuthUser | null {
		const entry = this.sessions.get(sessionId);
		if (!entry) return null;
		if (Date.now() - entry.createdAtMs > this.ttlMs) {
			this.sessions.delete(sessionId);
			return null;
		}
		return entry.user;
	}

	remove(sessionId: string): void {
		this.sessions.delete(sessionId);
	}

	cleanup(): number {
		const now = Date.now();
		let removed = 0;
		for (const [id, entry] of this.sessions) {
			if (now - entry.createdAtMs > this.ttlMs) {
				this.sessions.delete(id);
				removed++;
			}
		}
		return removed;
	}

	size(): number {
		return this.sessions.size;
	}
}

/**
 * Pending OIDC state store. Entries live for 5 minutes max and are
 * consumed on `take` (single-use, prevents replay).
 */
export class PendingOidcStateStore {
	private static readonly TTL_MS = 5 * 60 * 1000;
	private readonly states = new Map<string, PendingState>();

	insert(
		state: string,
		pkceVerifier: string,
		nonce: string,
		originalUrl: string,
	): void {
		this.states.set(state, {
			pkceVerifier,
			nonce,
			originalUrl,
			createdAtMs: Date.now(),
		});
	}

	take(state: string): {
		pkceVerifier: string;
		nonce: string;
		originalUrl: string;
	} | null {
		const entry = this.states.get(state);
		if (!entry) return null;
		this.states.delete(state);
		if (Date.now() - entry.createdAtMs > PendingOidcStateStore.TTL_MS) {
			return null;
		}
		return {
			pkceVerifier: entry.pkceVerifier,
			nonce: entry.nonce,
			originalUrl: entry.originalUrl,
		};
	}

	cleanup(): number {
		const now = Date.now();
		let removed = 0;
		for (const [id, entry] of this.states) {
			if (now - entry.createdAtMs > PendingOidcStateStore.TTL_MS) {
				this.states.delete(id);
				removed++;
			}
		}
		return removed;
	}
}

// ── Helpers ──

const SESSION_COOKIE_NAME = "fc_session";

function base64UrlEncode(buf: Buffer): string {
	return buf
		.toString("base64")
		.replace(/=+$/, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

function generateRandomString(byteLength: number): string {
	return base64UrlEncode(randomBytes(byteLength));
}

function pkceChallenge(verifier: string): string {
	return base64UrlEncode(createHash("sha256").update(verifier).digest());
}

export function extractSessionCookie(request: FastifyRequest): string | null {
	const cookieHeader = request.headers.cookie;
	if (!cookieHeader) return null;
	for (const part of cookieHeader.split(";")) {
		const trimmed = part.trim();
		if (trimmed.startsWith(`${SESSION_COOKIE_NAME}=`)) {
			return trimmed.slice(SESSION_COOKIE_NAME.length + 1);
		}
	}
	return null;
}

interface DiscoveryDoc {
	authorization_endpoint: string;
	token_endpoint: string;
	jwks_uri: string;
}

async function fetchDiscovery(issuerUrl: string): Promise<DiscoveryDoc> {
	const trimmed = issuerUrl.replace(/\/+$/, "");
	const wellKnown = `${trimmed}/.well-known/openid-configuration`;
	const response = await fetch(wellKnown);
	if (!response.ok) {
		throw new Error(
			`OIDC discovery failed: ${response.status} ${response.statusText}`,
		);
	}
	const doc = (await response.json()) as Partial<DiscoveryDoc>;
	if (!doc.authorization_endpoint || !doc.token_endpoint || !doc.jwks_uri) {
		throw new Error("OIDC discovery document missing required endpoints");
	}
	return doc as DiscoveryDoc;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new Error("Token is not a valid JWT (expected 3 parts)");
	}
	const payload = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
	const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
	const json = Buffer.from(padded, "base64").toString("utf-8");
	return JSON.parse(json) as Record<string, unknown>;
}

function claimsToAuthUser(payload: Record<string, unknown>): AuthUser {
	const realmAccess = payload["realm_access"] as
		| { roles?: string[] }
		| undefined;
	return {
		sub: payload["sub"] as string | undefined,
		username:
			(payload["preferred_username"] as string | undefined) ??
			(payload["email"] as string | undefined) ??
			(payload["sub"] as string | undefined),
		email: payload["email"] as string | undefined,
		name: payload["name"] as string | undefined,
		roles: realmAccess?.roles ?? [],
		authMode: "OIDC",
	};
}

// ── Plugin ──

export interface OidcFlowPluginOptions {
	config: OidcFlowConfig;
	sessionStore: SessionStore;
	pendingStates: PendingOidcStateStore;
	logger: Logger;
}

const oidcFlowPluginAsync: FastifyPluginAsync<OidcFlowPluginOptions> = async (
	fastify,
	opts,
) => {
	const { config, sessionStore, pendingStates, logger } = opts;
	const childLogger = logger.child({ component: "OidcFlow" });

	const jwks = jose.createRemoteJWKSet(
		new URL((await fetchDiscovery(config.issuerUrl)).jwks_uri),
	);

	async function validateIdToken(
		token: string,
	): Promise<Record<string, unknown>> {
		const verifyOptions: jose.JWTVerifyOptions = { issuer: config.issuerUrl };
		if (config.audience ?? config.clientId) {
			verifyOptions.audience = config.audience ?? config.clientId;
		}
		const { payload } = await jose.jwtVerify(token, jwks, verifyOptions);
		return payload as Record<string, unknown>;
	}

	fastify.get<{ Querystring: { redirect_to?: string } }>(
		"/login",
		async (request, reply) => {
			const originalUrl = request.query.redirect_to ?? "/";
			const pkceVerifier = generateRandomString(48);
			const codeChallenge = pkceChallenge(pkceVerifier);
			const state = generateRandomString(24);
			const nonce = generateRandomString(24);

			pendingStates.insert(state, pkceVerifier, nonce, originalUrl);

			let discovery: DiscoveryDoc;
			try {
				discovery = await fetchDiscovery(config.issuerUrl);
			} catch (err) {
				childLogger.error({ err }, "OIDC discovery failed during login");
				return reply.code(500).send({
					error: "oidc_discovery_failed",
					message: err instanceof Error ? err.message : String(err),
				});
			}

			const authUrl = new URL(discovery.authorization_endpoint);
			authUrl.searchParams.set("client_id", config.clientId);
			authUrl.searchParams.set("redirect_uri", config.redirectUri);
			authUrl.searchParams.set("response_type", "code");
			authUrl.searchParams.set("scope", config.scopes.join(" "));
			authUrl.searchParams.set("state", state);
			authUrl.searchParams.set("nonce", nonce);
			authUrl.searchParams.set("code_challenge", codeChallenge);
			authUrl.searchParams.set("code_challenge_method", "S256");

			childLogger.debug({ authUrl: authUrl.toString() }, "Redirecting to IdP");
			return reply.redirect(authUrl.toString(), 302);
		},
	);

	fastify.get<{ Querystring: { code?: string; state?: string } }>(
		"/callback",
		async (request, reply) => {
			const { code, state } = request.query;
			if (!code || !state) {
				return reply.code(400).send({
					error: "invalid_callback",
					message: "Missing code or state parameter",
				});
			}

			const pending = pendingStates.take(state);
			if (!pending) {
				childLogger.warn(
					{ state },
					"Unknown or expired OIDC state parameter",
				);
				return reply.code(400).send({
					error: "invalid_state",
					message:
						"Unknown or expired state parameter. Please try logging in again.",
				});
			}

			let discovery: DiscoveryDoc;
			try {
				discovery = await fetchDiscovery(config.issuerUrl);
			} catch (err) {
				childLogger.error({ err }, "OIDC discovery failed during callback");
				return reply.code(500).send({
					error: "oidc_discovery_failed",
					message: err instanceof Error ? err.message : String(err),
				});
			}

			// Exchange code for tokens
			const body = new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: config.redirectUri,
				client_id: config.clientId,
				code_verifier: pending.pkceVerifier,
			});
			if (config.clientSecret) {
				body.set("client_secret", config.clientSecret);
			}

			let tokenResponse: Response;
			try {
				tokenResponse = await fetch(discovery.token_endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: body.toString(),
				});
			} catch (err) {
				childLogger.error({ err }, "Token endpoint request failed");
				return reply.code(502).send({
					error: "token_exchange_error",
					message: err instanceof Error ? err.message : String(err),
				});
			}

			if (!tokenResponse.ok) {
				const errBody = await tokenResponse.text();
				childLogger.error(
					{ status: tokenResponse.status, body: errBody },
					"Token exchange failed",
				);
				return reply.code(502).send({
					error: "token_exchange_failed",
					message: `Token endpoint returned ${tokenResponse.status}`,
				});
			}

			const tokens = (await tokenResponse.json()) as {
				id_token?: string;
				access_token?: string;
			};
			const idToken = tokens.id_token ?? tokens.access_token;
			if (!idToken) {
				childLogger.error("Token response missing id_token and access_token");
				return reply.code(502).send({
					error: "no_token",
					message: "Token response did not contain an id_token or access_token",
				});
			}

			let claims: Record<string, unknown>;
			try {
				claims = await validateIdToken(idToken);
			} catch (err) {
				childLogger.warn({ err }, "ID token validation failed");
				return reply.code(401).send({
					error: "token_validation_failed",
					message: err instanceof Error ? err.message : String(err),
				});
			}

			// Best-effort nonce check (payload-level; the signature was just verified).
			try {
				const payload = decodeJwtPayload(idToken);
				const tokenNonce = payload["nonce"];
				if (
					typeof tokenNonce === "string" &&
					tokenNonce !== pending.nonce
				) {
					childLogger.warn(
						{ expected: pending.nonce, actual: tokenNonce },
						"Nonce mismatch",
					);
					return reply.code(401).send({
						error: "nonce_mismatch",
						message: "ID token nonce did not match the value sent at login",
					});
				}
			} catch (err) {
				childLogger.warn({ err }, "Failed to decode nonce from ID token");
			}

			const user = claimsToAuthUser(claims);
			const sessionId = generateRandomString(36);
			sessionStore.insert(sessionId, user);

			childLogger.info(
				{ sub: user.sub, email: user.email },
				"OIDC flow: session created",
			);

			reply.header(
				"Set-Cookie",
				`${SESSION_COOKIE_NAME}=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${config.sessionTtlSeconds}`,
			);
			return reply.redirect(pending.originalUrl, 302);
		},
	);

	fastify.get("/logout", async (request, reply) => {
		const sessionId = extractSessionCookie(request);
		if (sessionId) {
			sessionStore.remove(sessionId);
			childLogger.debug({ sessionId }, "Session removed on logout");
		}
		reply.header(
			"Set-Cookie",
			`${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
		);
		return { status: "logged_out" };
	});

	// Eager discovery fetch + JWKS warm-up done above. Background cleanup
	// of expired entries every 60s, unref'd so it doesn't block exit.
	const cleanupHandle = setInterval(() => {
		const sessions = sessionStore.cleanup();
		const pending = pendingStates.cleanup();
		if (sessions > 0 || pending > 0) {
			childLogger.debug(
				{ sessions, pending },
				"OIDC store cleanup pass",
			);
		}
	}, 60_000);
	cleanupHandle.unref?.();

	fastify.addHook("onClose", async () => {
		clearInterval(cleanupHandle);
	});
};

export const oidcFlowPlugin = fp(oidcFlowPluginAsync, {
	name: "@flowcatalyst/message-router-oidc-flow",
	fastify: "5.x",
});
