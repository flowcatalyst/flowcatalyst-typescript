/**
 * Login Rate Limit Service
 *
 * Implements the layered rate-limit model for password login attempts:
 *
 *   Layer A: per-(email, IP) exponential backoff
 *     N free attempts, then base * factor^(N - free), capped at maxDelay.
 *     Targets single-IP brute force without locking out the legitimate
 *     user from a different IP.
 *
 *   Layer C: per-email global ceiling (INTERNAL accounts only)
 *     >= maxFailures FAILUREs in the sliding window → hard lockout for
 *     lockoutDuration. Targets distributed (botnet/Tor) attacks against
 *     a single account. Skipped for federated (OIDC) users — there is
 *     no local password to brute-force.
 *
 * Layer B (per-IP burst across all auth endpoints) is enforced by a
 * separate Fastify pre-handler so it fires before any DB query.
 *
 * Storage: layers A and C read from `iam_login_attempts`. No new state
 * tables. The "lockout" is computed dynamically — if there are >= N
 * failures in the last window, the account is currently locked. There
 * is no lockedAt column to keep in sync.
 */

import type {
	LoginAttemptRepository,
	EmailIpFailureContext,
} from "../persistence/repositories/login-attempt-repository.js";

export interface LoginRateLimitConfig {
	/** Master enable flag. False disables all layers (use in tests). */
	readonly enabled: boolean;

	// Layer A — per-(email, IP) exponential backoff
	/** Free attempts before backoff kicks in (e.g. 3). */
	readonly perEmailIpFreeAttempts: number;
	/** Base delay applied at attempt freeAttempts+1, in milliseconds. */
	readonly perEmailIpBaseDelayMs: number;
	/** Multiplier applied each subsequent failure (e.g. 2 for doubling). */
	readonly perEmailIpFactor: number;
	/** Maximum delay between attempts, in milliseconds (caps the curve). */
	readonly perEmailIpMaxDelayMs: number;

	// Layer C — per-email global ceiling (INTERNAL only)
	/** Failures within window that trigger lockout (e.g. 10). */
	readonly perEmailMaxFailuresInWindow: number;
	/** Sliding window for counting failures, in minutes. */
	readonly perEmailWindowMinutes: number;
	/** Lockout duration, in minutes. */
	readonly perEmailLockoutMinutes: number;
}

export const defaultLoginRateLimitConfig: LoginRateLimitConfig = {
	enabled: true,
	perEmailIpFreeAttempts: 3,
	perEmailIpBaseDelayMs: 2_000,
	perEmailIpFactor: 2,
	perEmailIpMaxDelayMs: 5 * 60 * 1_000,
	perEmailMaxFailuresInWindow: 10,
	perEmailWindowMinutes: 15,
	perEmailLockoutMinutes: 15,
};

export type LoginRateLimitReason = "BACKOFF" | "LOCKED";

export type LoginRateLimitDecision =
	| { readonly allowed: true }
	| {
			readonly allowed: false;
			readonly reason: LoginRateLimitReason;
			readonly retryAfterSeconds: number;
	  };

export class LoginRateLimitService {
	private readonly loginAttempts: LoginAttemptRepository;
	private readonly config: LoginRateLimitConfig;

	constructor(
		loginAttempts: LoginAttemptRepository,
		config: LoginRateLimitConfig = defaultLoginRateLimitConfig,
	) {
		this.loginAttempts = loginAttempts;
		this.config = config;
	}

	/**
	 * Decide whether a login attempt is allowed right now.
	 *
	 * Pass `isFederated = true` for users whose `idpType !== 'INTERNAL'`.
	 * Federated users skip the layer C lockout (no local password) but
	 * still hit layer A so a brute-force attempt against a federated
	 * email is also slowed.
	 *
	 * If `email` is unknown (e.g. the login form was submitted with a
	 * non-existent address) pass `isFederated = false` — the layer C
	 * count won't trigger because there will be no real account to lock,
	 * and it doesn't reveal user existence either way.
	 */
	async check(
		email: string,
		ipAddress: string | null,
		isFederated: boolean,
		now: Date = new Date(),
	): Promise<LoginRateLimitDecision> {
		if (!this.config.enabled) return { allowed: true };

		// Layer C — per-email lockout (skipped for federated users).
		if (!isFederated) {
			const windowStart = new Date(
				now.getTime() - this.config.perEmailWindowMinutes * 60_000,
			);
			const failures = await this.loginAttempts.countFailuresByIdentifierSince(
				email,
				windowStart,
			);
			if (failures >= this.config.perEmailMaxFailuresInWindow) {
				// Lockout is computed implicitly: if there are >= N failures
				// in the last `lockoutMinutes` window, the account stays locked
				// until the oldest of those failures falls outside the window.
				// We approximate by using the configured lockout duration —
				// the user retries after `lockoutMinutes` and at that point
				// either the window has cleared or the attacker is still
				// active (and we'll still be locked out).
				const retryAfterSeconds = this.config.perEmailLockoutMinutes * 60;
				return { allowed: false, reason: "LOCKED", retryAfterSeconds };
			}
		}

		// Layer A — per-(email, IP) exponential backoff.
		const ctx = await this.loginAttempts.getIdentifierIpFailureContext(
			email,
			ipAddress,
		);
		const delayMs = this.computeBackoffMs(ctx);
		if (delayMs > 0 && ctx.lastFailureAt !== null) {
			const allowedAt = ctx.lastFailureAt.getTime() + delayMs;
			const remainingMs = allowedAt - now.getTime();
			if (remainingMs > 0) {
				return {
					allowed: false,
					reason: "BACKOFF",
					retryAfterSeconds: Math.max(1, Math.ceil(remainingMs / 1_000)),
				};
			}
		}

		return { allowed: true };
	}

	/**
	 * Required wait between attempts given the current failure count
	 * for an (email, IP) pair. Returns 0 if the user is still in the
	 * "free attempts" zone.
	 */
	private computeBackoffMs(ctx: EmailIpFailureContext): number {
		const overFree = ctx.failureCount - this.config.perEmailIpFreeAttempts;
		if (overFree <= 0) return 0;
		// First post-free failure → base; second → base * factor; ...
		const delay =
			this.config.perEmailIpBaseDelayMs *
			Math.pow(this.config.perEmailIpFactor, overFree - 1);
		return Math.min(delay, this.config.perEmailIpMaxDelayMs);
	}
}
