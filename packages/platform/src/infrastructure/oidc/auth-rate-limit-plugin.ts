/**
 * Auth/Token IP Rate Limit Plugin
 *
 * Layer B of the login rate-limit model + per-IP rate limit on the
 * OAuth/OIDC token endpoints. In-process (rate-limiter-flexible
 * RateLimiterMemory); runs *before* any DB query so a flood of traffic
 * from a single IP doesn't churn the database.
 *
 * Two limiters, attached as path-prefix `onRequest` hooks:
 *   - authLimiter: matches every path starting with `/auth/`. Covers
 *     /auth/login, /auth/oidc/login, /auth/password-reset/*,
 *     /auth/check-domain, /auth/client/*, etc. Catches single-IP
 *     probing across many emails / endpoints.
 *   - tokenLimiter: matches the explicit OAuth/OIDC token endpoints
 *     (introspection / revocation / token / aliases). Catches
 *     refresh-token churn and grant abuse from a single IP.
 *
 * The IP key is read via getClientIp() with the operator-configured
 * TRUSTED_PROXY_HOPS — NOT request.ip. Fastify's trustProxy mechanism
 * returns the leftmost X-Forwarded-For value, which is attacker-controlled
 * under appending proxies (ALB, CloudFront). See client-ip.ts.
 *
 * Per-instance storage. Active/active deployment requires migrating to
 * RateLimiterRedis (same interface). See ARCHITECTURE.md
 * "Scaling and Operating Topology".
 *
 * What this does NOT cover yet:
 *   - Per-client_id rate limit on the token endpoint. Catches refresh-
 *     token abuse from one client across many IPs. Requires reading the
 *     form-encoded body before forwarding to oidc-provider — a separate
 *     follow-up; tracked in the rate-limit module-level note.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { getClientIp } from "./client-ip.js";

export interface AuthRateLimitConfig {
	readonly enabled: boolean;
	/** Auth-endpoint per-IP requests per minute. */
	readonly authIpRequestsPerMinute: number;
	/** Token-endpoint per-IP requests per minute. */
	readonly tokenIpRequestsPerMinute: number;
	/**
	 * Trusted appending-proxy hops. Used for IP key derivation. See
	 * client-ip.ts for the full explanation. Get this wrong and an
	 * attacker can rotate X-Forwarded-For to get a fresh bucket per
	 * request — make it match the deployment topology.
	 */
	readonly trustedProxyHops: number;
}

export const defaultAuthRateLimitConfig: AuthRateLimitConfig = {
	enabled: true,
	authIpRequestsPerMinute: 60,
	tokenIpRequestsPerMinute: 120,
	trustedProxyHops: 0,
};

export class AuthRateLimiters {
	private readonly authLimiter: RateLimiterMemory;
	private readonly tokenLimiter: RateLimiterMemory;
	private readonly enabled: boolean;
	private readonly trustedProxyHops: number;

	constructor(config: AuthRateLimitConfig = defaultAuthRateLimitConfig) {
		this.enabled = config.enabled;
		this.trustedProxyHops = config.trustedProxyHops;
		this.authLimiter = new RateLimiterMemory({
			points: config.authIpRequestsPerMinute,
			duration: 60,
		});
		this.tokenLimiter = new RateLimiterMemory({
			points: config.tokenIpRequestsPerMinute,
			duration: 60,
		});
	}

	/** Resolve the rate-limit key for a request via the safe extractor. */
	clientIpKey(request: FastifyRequest): string {
		return (
			getClientIp(request, { trustedHops: this.trustedProxyHops }) ??
			"unknown"
		);
	}

	private async consumeOrReject(
		limiter: RateLimiterMemory,
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void> {
		if (!this.enabled) return;
		const key = this.clientIpKey(request);
		try {
			await limiter.consume(key, 1);
		} catch (err) {
			if (err instanceof RateLimiterRes) {
				const retryAfter = Math.max(1, Math.ceil(err.msBeforeNext / 1_000));
				reply.header("Retry-After", String(retryAfter));
				await reply.code(429).send({
					code: "RATE_LIMITED",
					message: "Too many requests. Try again later.",
				});
				return;
			}
			throw err;
		}
	}

	/**
	 * Pre-handler for /auth/* (also exposed for legacy per-route wiring).
	 * Prefer registerAuthIpRateLimit() which covers the whole subtree.
	 */
	authIpPreHandler = async (
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void> => this.consumeOrReject(this.authLimiter, request, reply);

	tokenIpPreHandler = async (
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void> => this.consumeOrReject(this.tokenLimiter, request, reply);
}

/**
 * Apply the auth IP limit to every path starting with the given prefix
 * (default `/auth/`). Covers all current and future /auth/* routes
 * without needing per-route wiring.
 */
export function registerAuthIpRateLimit(
	fastify: FastifyInstance,
	limiters: AuthRateLimiters,
	prefix: string = "/auth/",
): void {
	fastify.addHook("onRequest", async (request, reply) => {
		const path = request.url.split("?")[0] ?? request.url;
		if (!path.startsWith(prefix)) return;
		await limiters.authIpPreHandler(request, reply);
	});
}

/**
 * Apply the token IP limit to the listed paths (exact match). Use exact
 * paths rather than a prefix because /oidc/auth, /oidc/jwks, etc. share
 * the /oidc prefix but have different rate-limit needs.
 */
export function registerTokenIpRateLimit(
	fastify: FastifyInstance,
	limiters: AuthRateLimiters,
	paths: readonly string[],
): void {
	const set = new Set(paths);
	fastify.addHook("onRequest", async (request, reply) => {
		const path = request.url.split("?")[0] ?? request.url;
		if (!set.has(path)) return;
		await limiters.tokenIpPreHandler(request, reply);
	});
}
