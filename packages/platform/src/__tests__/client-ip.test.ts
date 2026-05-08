import { describe, it, expect } from "vitest";
import type { FastifyRequest } from "fastify";
import { getClientIp } from "../infrastructure/oidc/client-ip.js";

/**
 * Build a request stub with the bits getClientIp() reads. Keep narrow:
 * if getClientIp grows to look at more fields, this stub will surface
 * the dependency the next time someone touches it.
 */
function makeReq(opts: {
	xff?: string | string[];
	socket?: string | null;
}): FastifyRequest {
	const headers: Record<string, string | string[]> = {};
	if (opts.xff !== undefined) headers["x-forwarded-for"] = opts.xff;
	const socket =
		opts.socket === null
			? null
			: { remoteAddress: opts.socket ?? "10.0.0.1" };
	return {
		headers,
		socket,
	} as unknown as FastifyRequest;
}

describe("getClientIp — no proxy (trustedHops=0)", () => {
	it("returns socket address even when X-Forwarded-For is set", () => {
		const req = makeReq({
			xff: "1.2.3.4, 5.6.7.8",
			socket: "10.0.0.1",
		});
		expect(getClientIp(req, { trustedHops: 0 })).toBe("10.0.0.1");
	});

	it("returns null when socket has no remoteAddress and trustedHops=0", () => {
		const req = makeReq({ xff: "1.2.3.4", socket: null });
		expect(getClientIp(req, { trustedHops: 0 })).toBeNull();
	});

	it("treats trustedHops as 0 when negative (defensive)", () => {
		const req = makeReq({ xff: "1.2.3.4", socket: "10.0.0.1" });
		expect(getClientIp(req, { trustedHops: -1 })).toBe("10.0.0.1");
	});
});

describe("getClientIp — single appending proxy (trustedHops=1, e.g. ALB-only)", () => {
	it("returns the rightmost X-Forwarded-For entry — what the ALB attributed to the client", () => {
		// Attacker-spoofed value on the left, real client on the right.
		const req = makeReq({
			xff: "<attacker-spoofed>, 198.51.100.42",
			socket: "10.0.0.1",
		});
		expect(getClientIp(req, { trustedHops: 1 })).toBe("198.51.100.42");
	});

	it("ignores attacker-rotation: result is stable regardless of leftmost value", () => {
		// Each request the attacker rotates the leftmost. The chosen IP
		// should always be the rightmost (real client).
		const r1 = makeReq({ xff: "1.1.1.1, 198.51.100.42", socket: "10.0.0.1" });
		const r2 = makeReq({ xff: "2.2.2.2, 198.51.100.42", socket: "10.0.0.1" });
		const r3 = makeReq({ xff: "3.3.3.3, 198.51.100.42", socket: "10.0.0.1" });
		expect(getClientIp(r1, { trustedHops: 1 })).toBe("198.51.100.42");
		expect(getClientIp(r2, { trustedHops: 1 })).toBe("198.51.100.42");
		expect(getClientIp(r3, { trustedHops: 1 })).toBe("198.51.100.42");
	});

	it("falls back to socket when X-Forwarded-For is absent", () => {
		const req = makeReq({ socket: "10.0.0.1" });
		expect(getClientIp(req, { trustedHops: 1 })).toBe("10.0.0.1");
	});

	it("falls back to socket when X-Forwarded-For is empty string", () => {
		const req = makeReq({ xff: "", socket: "10.0.0.1" });
		expect(getClientIp(req, { trustedHops: 1 })).toBe("10.0.0.1");
	});

	it("trims whitespace around values", () => {
		const req = makeReq({
			xff: "  1.2.3.4  ,  198.51.100.42  ",
			socket: "10.0.0.1",
		});
		expect(getClientIp(req, { trustedHops: 1 })).toBe("198.51.100.42");
	});

	it("handles a single-entry chain (no spoofed prefix)", () => {
		const req = makeReq({ xff: "198.51.100.42", socket: "10.0.0.1" });
		expect(getClientIp(req, { trustedHops: 1 })).toBe("198.51.100.42");
	});
});

describe("getClientIp — two appending proxies (trustedHops=2, e.g. CloudFront → ALB)", () => {
	it("returns the second-from-right entry — what CloudFront attributed", () => {
		// CloudFront sees client at 198.51.100.42, appends to chain.
		// ALB then appends CloudFront's edge IP. Attacker spoofed
		// the leftmost.
		const req = makeReq({
			xff: "<spoof>, 198.51.100.42, 192.0.2.1",
			socket: "10.0.0.1",
		});
		expect(getClientIp(req, { trustedHops: 2 })).toBe("198.51.100.42");
	});

	it("falls back to socket when chain is shorter than trustedHops", () => {
		// Topology says 2 hops but chain only has 1 — likely tampered or
		// misconfigured. Don't return a value the operator doesn't expect.
		const req = makeReq({ xff: "198.51.100.42", socket: "10.0.0.1" });
		expect(getClientIp(req, { trustedHops: 2 })).toBe("10.0.0.1");
	});
});

describe("getClientIp — header value variants", () => {
	it("handles array header value (multiple X-Forwarded-For headers)", () => {
		const req = makeReq({
			xff: ["<spoof>", "198.51.100.42"],
			socket: "10.0.0.1",
		});
		// Joined with comma → treated as a chain.
		expect(getClientIp(req, { trustedHops: 1 })).toBe("198.51.100.42");
	});

	it("filters out empty entries from extra commas", () => {
		const req = makeReq({
			xff: "1.1.1.1,,,198.51.100.42",
			socket: "10.0.0.1",
		});
		expect(getClientIp(req, { trustedHops: 1 })).toBe("198.51.100.42");
	});

	it("returns null if no socket and no usable X-Forwarded-For at trustedHops=0", () => {
		const req = makeReq({ socket: null });
		expect(getClientIp(req, { trustedHops: 0 })).toBeNull();
	});
});
