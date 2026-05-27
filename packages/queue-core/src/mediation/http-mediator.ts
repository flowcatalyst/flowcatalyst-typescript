import { createHmac } from "node:crypto";
import { request, Agent } from "undici";
import type { Dispatcher } from "undici";
import type { Logger } from "@flowcatalyst/logging";
import type {
	MediationResponse,
	ProcessingResult,
	QueueMessage,
} from "@flowcatalyst/contracts";
import {
	CircuitBreakerOpenError,
	type CircuitBreakerManager,
} from "./circuit-breaker.js";
import {
	ConnectionFailureError,
	ConnectionTimeoutError,
	RequestTimeoutError,
	toMediationError,
} from "./mediation-error.js";

/** Webhook signature header — matches Rust `SIGNATURE_HEADER`. */
export const SIGNATURE_HEADER = "X-FLOWCATALYST-SIGNATURE";
/** Webhook timestamp header — matches Rust `TIMESTAMP_HEADER`. */
export const TIMESTAMP_HEADER = "X-FLOWCATALYST-TIMESTAMP";

/**
 * Compute the HMAC-SHA256 signature over `timestamp + body` using
 * `signingSecret`. Returns lowercase hex (matches Java's
 * `HexFormat.of().formatHex()` and Rust's `hex::encode`). The
 * timestamp is ISO8601 with millisecond precision — what
 * `Date.prototype.toISOString()` already returns.
 */
export function signWebhook(
	body: string,
	signingSecret: string,
): { signature: string; timestamp: string } {
	const timestamp = new Date().toISOString();
	const signature = createHmac("sha256", signingSecret)
		.update(timestamp + body)
		.digest("hex");
	return { signature, timestamp };
}

/**
 * HTTP Mediator configuration
 */
export interface HttpMediatorConfig {
	/** Default callback URL */
	callbackUrl: string;
	/** Use HTTP/2 (true) or HTTP/1.1 (false) */
	useHttp2: boolean;
	/** Connection timeout in milliseconds */
	connectTimeoutMs: number;
	/** Headers timeout in milliseconds */
	headersTimeoutMs: number;
	/** Body/request timeout in milliseconds */
	bodyTimeoutMs: number;
	/** Number of retries */
	retries: number;
	/** Initial retry delay in milliseconds */
	retryDelayMs: number;
	/**
	 * HTTP/2 only: client-side cap on concurrent streams per connection.
	 * Effective value is min(this, server's SETTINGS_MAX_CONCURRENT_STREAMS).
	 * undici's default (100) starves at high fan-out; set higher for
	 * wide-multiplex workloads.
	 */
	h2MaxConcurrentStreams?: number;
	/**
	 * Number of connections (H/1 sockets or H/2 connections) per origin.
	 * For H/2, a small number (2–4) is usually sufficient because of
	 * stream multiplexing; more gives bandwidth headroom and failover.
	 */
	connectionsPerOrigin?: number;
}

/**
 * HTTP Mediator - calls downstream services
 *
 * - HTTP/2 for production (single multiplexed connection)
 * - HTTP/1.1 for local dev
 * - Separate connection timeout vs request timeout
 * - Circuit breaker integration
 * - Exponential backoff retry
 */
export class HttpMediator {
	private readonly config: HttpMediatorConfig;
	private readonly logger: Logger;
	private readonly circuitBreakers: CircuitBreakerManager;
	private readonly agent: Agent;

	constructor(
		config: HttpMediatorConfig,
		circuitBreakers: CircuitBreakerManager,
		logger: Logger,
	) {
		this.config = config;
		this.circuitBreakers = circuitBreakers;
		this.logger = logger.child({ component: "HttpMediator" });

		this.agent = new Agent({
			connect: {
				timeout: config.connectTimeoutMs,
			},
			headersTimeout: config.headersTimeoutMs,
			bodyTimeout: config.bodyTimeoutMs,
			allowH2: config.useHttp2,
			...(config.connectionsPerOrigin != null
				? { connections: config.connectionsPerOrigin }
				: {}),
			...(config.useHttp2 && config.h2MaxConcurrentStreams != null
				? { maxConcurrentStreams: config.h2MaxConcurrentStreams }
				: {}),
		});

		this.logger.info(
			{
				http2: config.useHttp2,
				connectTimeoutMs: config.connectTimeoutMs,
				bodyTimeoutMs: config.bodyTimeoutMs,
				connectionsPerOrigin: config.connectionsPerOrigin ?? "default",
				h2MaxConcurrentStreams: config.useHttp2
					? (config.h2MaxConcurrentStreams ?? "default(100)")
					: "n/a",
			},
			"HTTP mediator initialized",
		);
	}

	/**
	 * Process a message by calling the downstream service
	 */
	async process(message: QueueMessage): Promise<ProcessingResult> {
		const startTime = Date.now();
		const callbackUrl = message.pointer.callbackUrl || this.config.callbackUrl;

		const circuitBreaker = this.circuitBreakers.getOrCreate(callbackUrl);

		try {
			const result = await circuitBreaker.execute(async () => {
				return this.executeWithRetry(message, callbackUrl);
			});
			return result;
		} catch (error) {
			const durationMs = Date.now() - startTime;

			if (error instanceof CircuitBreakerOpenError) {
				this.logger.warn(
					{ callbackUrl, messageId: message.messageId },
					"Circuit breaker open - request rejected",
				);
				return {
					outcome: "ERROR_PROCESS",
					error: "Circuit breaker open",
					durationMs,
				};
			}

			this.logger.error(
				{ err: error, callbackUrl, messageId: message.messageId },
				"Mediation failed",
			);
			return {
				outcome: "ERROR_PROCESS",
				error: error instanceof Error ? error.message : "Unknown error",
				durationMs,
			};
		}
	}

	/**
	 * Execute HTTP request with retry logic
	 */
	private async executeWithRetry(
		message: QueueMessage,
		callbackUrl: string,
	): Promise<ProcessingResult> {
		let lastError: Error | null = null;
		const startTime = Date.now();

		for (let attempt = 0; attempt <= this.config.retries; attempt++) {
			try {
				if (attempt > 0) {
					const delay = this.config.retryDelayMs * attempt;
					this.logger.debug(
						{ attempt, delay, messageId: message.messageId },
						"Retrying request",
					);
					await sleep(delay);
				}

				const result = await this.executeRequest(message, callbackUrl);

				// Don't retry on success, client errors, rate limits, or deferred.
				// For RATE_LIMITED we want the queue to apply the Retry-After
				// delay rather than blocking this worker on in-process backoff.
				if (
					result.outcome === "SUCCESS" ||
					result.outcome === "ERROR_CONFIG" ||
					result.outcome === "DEFERRED" ||
					result.outcome === "RATE_LIMITED"
				) {
					return result;
				}

				lastError = new Error(result.error || "Server error");
			} catch (error) {
				const mediationError = toMediationError(error);
				lastError = mediationError;

				if (
					mediationError instanceof ConnectionTimeoutError ||
					mediationError instanceof ConnectionFailureError
				) {
					this.logger.warn(
						{ err: mediationError, attempt, messageId: message.messageId },
						"Connection failure",
					);
				}
			}
		}

		const durationMs = Date.now() - startTime;
		return {
			outcome: "ERROR_PROCESS",
			error: lastError?.message || "Max retries exceeded",
			durationMs,
		};
	}

	/**
	 * Execute a single HTTP request
	 */
	private async executeRequest(
		message: QueueMessage,
		callbackUrl: string,
	): Promise<ProcessingResult> {
		const startTime = Date.now();

		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-Message-Id": message.messageId,
				"X-Broker-Message-Id": message.brokerMessageId,
				"X-Pool-Code": message.pointer.poolCode,
			};

			if (message.pointer.authToken) {
				headers["Authorization"] = `Bearer ${message.pointer.authToken}`;
			}

			const body = JSON.stringify({ messageId: message.messageId });

			if (message.pointer.signingSecret) {
				const { signature, timestamp } = signWebhook(
					body,
					message.pointer.signingSecret,
				);
				headers[SIGNATURE_HEADER] = signature;
				headers[TIMESTAMP_HEADER] = timestamp;
			}

			const response = await request(callbackUrl, {
				method: "POST",
				headers,
				body,
				dispatcher: this.agent,
			});

			const durationMs = Date.now() - startTime;
			const statusCode = response.statusCode;

			if (statusCode >= 200 && statusCode < 300) {
				return this.handleSuccessResponse(response, statusCode, durationMs);
			}

			if (statusCode === 429) {
				const retryAfterHeader = response.headers["retry-after"];
				const retryAfterRaw = Array.isArray(retryAfterHeader)
					? retryAfterHeader[0]
					: retryAfterHeader;
				const retryAfter = parseInt(retryAfterRaw ?? "", 10);
				const delaySeconds =
					Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 30;
				await this.readResponseBody(response); // drain body
				this.logger.warn(
					{ statusCode, callbackUrl, delaySeconds },
					"Rate limited by downstream",
				);
				return {
					outcome: "RATE_LIMITED",
					statusCode,
					error: "Rate limited by downstream",
					durationMs,
					delaySeconds,
				};
			}

			if (statusCode >= 400 && statusCode < 500) {
				const errorBody = await this.readResponseBody(response);
				this.logger.warn(
					{ statusCode, callbackUrl, error: errorBody },
					"Client error from downstream",
				);
				return {
					outcome: "ERROR_CONFIG",
					statusCode,
					error: `HTTP ${statusCode}: ${errorBody || "Client Error"}`,
					durationMs,
				};
			}

			const errorBody = await this.readResponseBody(response);
			this.logger.warn(
				{ statusCode, callbackUrl, error: errorBody },
				"Server error from downstream",
			);
			return {
				outcome: "ERROR_PROCESS",
				statusCode,
				error: `HTTP ${statusCode}: ${errorBody || "Server Error"}`,
				durationMs,
			};
		} catch (error) {
			const durationMs = Date.now() - startTime;
			const mediationError = toMediationError(error);

			if (mediationError instanceof ConnectionTimeoutError) {
				return {
					outcome: "ERROR_CONNECTION",
					error: `Connection timeout after ${this.config.connectTimeoutMs}ms`,
					durationMs,
				};
			}

			if (mediationError instanceof RequestTimeoutError) {
				return {
					outcome: "ERROR_PROCESS",
					error: `Request timeout after ${this.config.bodyTimeoutMs}ms`,
					durationMs,
				};
			}

			// ConnectionFailureError + MediationUnknownError both surface as
			// connection failures here — the worker can retry, and the
			// mediation layer doesn't try to second-guess what undici's
			// bug-of-the-day actually means.
			return {
				outcome: "ERROR_CONNECTION",
				error: mediationError.message,
				durationMs,
			};
		}
	}

	private async handleSuccessResponse(
		response: Dispatcher.ResponseData,
		statusCode: number,
		durationMs: number,
	): Promise<ProcessingResult> {
		try {
			const bodyText = await this.readResponseBody(response);

			if (!bodyText) {
				return { outcome: "SUCCESS", statusCode, durationMs };
			}

			const body = JSON.parse(bodyText) as MediationResponse;

			if (typeof body.ack === "boolean") {
				if (body.ack) {
					return { outcome: "SUCCESS", statusCode, durationMs };
				} else {
					return {
						outcome: "DEFERRED",
						statusCode,
						error: body.message || "Message deferred",
						durationMs,
						...(body.delaySeconds != null
							? { delaySeconds: body.delaySeconds }
							: {}),
					};
				}
			}

			return { outcome: "SUCCESS", statusCode, durationMs };
		} catch {
			return { outcome: "SUCCESS", statusCode, durationMs };
		}
	}

	private async readResponseBody(
		response: Dispatcher.ResponseData,
	): Promise<string> {
		try {
			const chunks: Buffer[] = [];
			for await (const chunk of response.body) {
				chunks.push(Buffer.from(chunk));
			}
			return Buffer.concat(chunks).toString("utf-8");
		} catch {
			return "";
		}
	}

	async close(): Promise<void> {
		await this.agent.close();
		this.logger.info("HTTP mediator closed");
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
