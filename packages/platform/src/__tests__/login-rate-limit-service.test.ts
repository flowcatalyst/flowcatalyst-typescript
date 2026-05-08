import { describe, it, expect } from "vitest";
import {
	LoginRateLimitService,
	type LoginRateLimitConfig,
} from "../infrastructure/oidc/login-rate-limit-service.js";
import type {
	LoginAttemptRepository,
	EmailIpFailureContext,
} from "../infrastructure/persistence/repositories/login-attempt-repository.js";

/**
 * Standard config used by most tests. Mirrors the production default so
 * the curve we assert against is the curve operators will see.
 */
const baseConfig: LoginRateLimitConfig = {
	enabled: true,
	perEmailIpFreeAttempts: 3,
	perEmailIpBaseDelayMs: 2_000,
	perEmailIpFactor: 2,
	perEmailIpMaxDelayMs: 5 * 60 * 1_000,
	perEmailMaxFailuresInWindow: 10,
	perEmailWindowMinutes: 15,
	perEmailLockoutMinutes: 15,
};

/**
 * Minimal in-memory stub. Only the two methods the service actually
 * calls are wired; the rest throw so a test that misuses the repo
 * fails loudly instead of silently swallowing wrong calls.
 */
function makeRepo(opts: {
	windowFailures?: number;
	ipContext?: EmailIpFailureContext;
}): LoginAttemptRepository {
	return {
		async countFailuresByIdentifierSince() {
			return opts.windowFailures ?? 0;
		},
		async getIdentifierIpFailureContext() {
			return opts.ipContext ?? { failureCount: 0, lastFailureAt: null };
		},
		async create() {
			throw new Error("create() should not be called by the rate-limit check");
		},
		async findPaged() {
			throw new Error("findPaged() should not be called by the rate-limit check");
		},
	};
}

describe("LoginRateLimitService — disabled", () => {
	it("always allows when enabled=false, regardless of state", async () => {
		const repo = makeRepo({
			windowFailures: 999,
			ipContext: { failureCount: 999, lastFailureAt: new Date() },
		});
		const svc = new LoginRateLimitService(repo, {
			...baseConfig,
			enabled: false,
		});
		const decision = await svc.check("user@example.com", "10.0.0.1", false);
		expect(decision.allowed).toBe(true);
	});
});

describe("LoginRateLimitService — Layer C (per-email lockout)", () => {
	it("allows below threshold for non-federated user", async () => {
		const repo = makeRepo({ windowFailures: 9 });
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", false);
		expect(decision.allowed).toBe(true);
	});

	it("locks at threshold for non-federated user", async () => {
		const repo = makeRepo({ windowFailures: 10 });
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", false);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return; // type guard for TS
		expect(decision.reason).toBe("LOCKED");
		expect(decision.retryAfterSeconds).toBe(15 * 60);
	});

	it("stays locked above threshold", async () => {
		const repo = makeRepo({ windowFailures: 100 });
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", false);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.reason).toBe("LOCKED");
	});

	it("does NOT lock federated users — they have no local password", async () => {
		// Even with way past the lockout threshold, isFederated=true skips C.
		// Layer A still applies but ipContext has no failures so backoff is 0.
		const repo = makeRepo({
			windowFailures: 999,
			ipContext: { failureCount: 0, lastFailureAt: null },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true);
		expect(decision.allowed).toBe(true);
	});
});

describe("LoginRateLimitService — Layer A (per-(email, IP) backoff)", () => {
	const now = new Date("2026-05-01T12:00:00Z");

	it("0 failures → allowed", async () => {
		const repo = makeRepo({
			ipContext: { failureCount: 0, lastFailureAt: null },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(true);
	});

	it("free attempts (1, 2, 3 failures) → allowed", async () => {
		for (const count of [1, 2, 3]) {
			const repo = makeRepo({
				ipContext: { failureCount: count, lastFailureAt: now },
			});
			const svc = new LoginRateLimitService(repo, baseConfig);
			const decision = await svc.check(
				"user@example.com",
				"10.0.0.1",
				true,
				now,
			);
			expect(decision.allowed, `failed at count=${count}`).toBe(true);
		}
	});

	it("4th failure (1st post-free) → 2s base delay", async () => {
		const repo = makeRepo({
			ipContext: { failureCount: 4, lastFailureAt: now },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.reason).toBe("BACKOFF");
		expect(decision.retryAfterSeconds).toBe(2);
	});

	it("doubles each subsequent failure: 5→4s, 6→8s, 7→16s", async () => {
		const expectations: Array<[number, number]> = [
			[5, 4],
			[6, 8],
			[7, 16],
		];
		for (const [failureCount, expectedSeconds] of expectations) {
			const repo = makeRepo({
				ipContext: { failureCount, lastFailureAt: now },
			});
			const svc = new LoginRateLimitService(repo, baseConfig);
			const decision = await svc.check(
				"user@example.com",
				"10.0.0.1",
				true,
				now,
			);
			expect(decision.allowed).toBe(false);
			if (decision.allowed) continue;
			expect(decision.retryAfterSeconds).toBe(expectedSeconds);
		}
	});

	it("caps at maxDelay (5 min) — failure count 12 → 300s", async () => {
		// Without cap: 2000 * 2^8 = 512s. With 300s cap: 300s.
		const repo = makeRepo({
			ipContext: { failureCount: 12, lastFailureAt: now },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.retryAfterSeconds).toBe(300);
	});

	it("cap holds for absurdly large failure counts", async () => {
		const repo = makeRepo({
			ipContext: { failureCount: 50, lastFailureAt: now },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.retryAfterSeconds).toBe(300);
	});

	it("allows once enough time has elapsed since last failure", async () => {
		// 4 failures = 2s required delay. Last failure was 5s ago — past it.
		const lastFailureAt = new Date(now.getTime() - 5_000);
		const repo = makeRepo({
			ipContext: { failureCount: 4, lastFailureAt },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(true);
	});

	it("retryAfter reflects remaining time, not full delay", async () => {
		// 4 failures = 2s required. Last failure 0.5s ago → ~1.5s remaining.
		const lastFailureAt = new Date(now.getTime() - 500);
		const repo = makeRepo({
			ipContext: { failureCount: 4, lastFailureAt },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		// Remaining is 1500ms = 2s after ceil. Allow ±1 for flooring/ceiling.
		expect(decision.retryAfterSeconds).toBeGreaterThanOrEqual(1);
		expect(decision.retryAfterSeconds).toBeLessThanOrEqual(2);
	});

	it("treats lastFailureAt=null as no backoff even if count > 0", async () => {
		// Defensive: shouldn't happen in practice (count > 0 implies a
		// timestamp exists) but should not throw or block forever.
		const repo = makeRepo({
			ipContext: { failureCount: 10, lastFailureAt: null },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(true);
	});

	it("works with null IP address", async () => {
		const repo = makeRepo({
			ipContext: { failureCount: 4, lastFailureAt: now },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", null, true, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.reason).toBe("BACKOFF");
	});
});

describe("LoginRateLimitService — composition", () => {
	const now = new Date("2026-05-01T12:00:00Z");

	it("Layer C takes precedence over Layer A when both would apply", async () => {
		// Both lockout (10 window failures) AND backoff (4 IP failures)
		// would trigger; expect LOCKED reason (the bigger hammer).
		const repo = makeRepo({
			windowFailures: 10,
			ipContext: { failureCount: 4, lastFailureAt: now },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", false, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.reason).toBe("LOCKED");
		expect(decision.retryAfterSeconds).toBe(15 * 60);
	});

	it("Federated user with high IP failure count gets backoff (C bypassed, A applies)", async () => {
		const repo = makeRepo({
			windowFailures: 999, // would lock if not federated
			ipContext: { failureCount: 5, lastFailureAt: now },
		});
		const svc = new LoginRateLimitService(repo, baseConfig);
		const decision = await svc.check("user@example.com", "10.0.0.1", true, now);
		expect(decision.allowed).toBe(false);
		if (decision.allowed) return;
		expect(decision.reason).toBe("BACKOFF");
		expect(decision.retryAfterSeconds).toBe(4);
	});
});
