/**
 * Client IP Extraction
 *
 * Reads the client IP from the X-Forwarded-For chain by counting trusted
 * appending proxies from the right. This is the only safe pattern under
 * load balancers that **append** to X-Forwarded-For (AWS ALB, GCP HTTPS LB,
 * Azure Front Door, …) rather than replace it.
 *
 * The bug we're avoiding:
 *   client → ALB:        X-Forwarded-For: <attacker-spoofed>
 *   ALB → app:           X-Forwarded-For: <attacker-spoofed>, <real-client-ip>
 *
 * Fastify's `trustProxy: true` and proxy-addr's leftmost-untrusted strategy
 * both return `<attacker-spoofed>` here. An attacker rotates the spoofed
 * value to get a fresh per-IP rate-limit bucket on every request, defeating
 * the limiter entirely. Same problem corrupts iam_login_attempts.ip_address.
 *
 * The fix: read the chain right-to-left by a configured trusted-hop count.
 * The rightmost N entries are the IPs that the trusted proxies (which we
 * control) wrote. The (N-th-from-right) is the actual client.
 *
 * Operators MUST set TRUSTED_PROXY_HOPS to match the topology:
 *   - No proxy / direct connection:  TRUSTED_PROXY_HOPS=0  (use socket addr)
 *   - Single ALB / nginx in front:    TRUSTED_PROXY_HOPS=1
 *   - CloudFront → ALB:               TRUSTED_PROXY_HOPS=2
 *   - Cloudflare → nginx → app:       TRUSTED_PROXY_HOPS=2
 *
 * If TRUSTED_PROXY_HOPS is set wrong the result will be "stable but wrong":
 * either an attacker-controlled value (too high) or a proxy IP (too low).
 * Verify in staging by hitting the app with `curl -H 'X-Forwarded-For: 1.2.3.4'`
 * and inspecting iam_login_attempts.ip_address.
 */

import type { FastifyRequest } from "fastify";

export interface ClientIpOptions {
	/** Number of trusted appending proxies. 0 disables X-Forwarded-For entirely. */
	readonly trustedHops: number;
}

export function getClientIp(
	request: FastifyRequest,
	options: ClientIpOptions,
): string | null {
	const socketAddr = request.socket?.remoteAddress ?? null;
	if (options.trustedHops <= 0) return socketAddr;

	const headerValue = request.headers["x-forwarded-for"];
	const xff = Array.isArray(headerValue)
		? headerValue.join(",")
		: (headerValue ?? "");
	if (!xff) return socketAddr;

	const chain = xff
		.split(",")
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
	if (chain.length === 0) return socketAddr;

	// Read trustedHops positions from the right of the chain. The rightmost
	// entry was written by our immediate proxy; the entry trustedHops-from-
	// the-right is what the outermost trusted proxy attributed to the client.
	const idx = chain.length - options.trustedHops;
	if (idx < 0) {
		// Chain is shorter than the configured hop count. Either the
		// header was tampered with (too few hops to reach an attacker
		// position) or the topology config is off. Fall back to socket.
		return socketAddr;
	}
	return chain[idx] ?? socketAddr;
}
