/**
 * Dispatch Job Processing Endpoint
 *
 * POST /api/dispatch/process — callback URL that the message router calls
 * with { messageId }. This endpoint:
 *
 * 1. Loads the dispatch job by ID
 * 2. Delivers the webhook to the target URL
 * 3. Records the attempt in msg_dispatch_job_attempts
 * 4. Updates the dispatch job status
 * 5. Returns ACK/NACK to the router
 */

import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type, type Static } from "@sinclair/typebox";
import { generateRaw } from "@flowcatalyst/tsid";
import {
	dispatchJobs,
	dispatchJobAttempts,
	type DispatchErrorType,
} from "@flowcatalyst/persistence";
import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// ── Request / Response Schemas ──────────────────────────────────────────

const ProcessRequestSchema = Type.Object({
	messageId: Type.String({ minLength: 1 }),
});

const ProcessResponseSchema = Type.Object({
	ack: Type.Boolean(),
	message: Type.Optional(Type.String()),
});

// ── Dependencies ────────────────────────────────────────────────────────

export interface DispatchProcessDeps {
	db: PostgresJsDatabase;
}

// ── Route Registration ──────────────────────────────────────────────────

export async function registerDispatchProcessRoutes(
	fastify: FastifyInstance,
	deps: DispatchProcessDeps,
): Promise<void> {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();
	const { db } = deps;

	f.post(
		"/process",
		{
			schema: {
				body: ProcessRequestSchema,
				response: { 200: ProcessResponseSchema },
			},
		},
		async (request, reply) => {
			const { messageId } = request.body as Static<
				typeof ProcessRequestSchema
			>;

			// 1. Load the dispatch job
			const [job] = await db
				.select()
				.from(dispatchJobs)
				.where(eq(dispatchJobs.id, messageId))
				.limit(1);

			if (!job) {
				request.log.warn({ messageId }, "Dispatch job not found, ACKing to remove from queue");
				return reply.send({ ack: true, message: "Job not found" });
			}

			// 2. Check if already terminal
			const terminalStatuses = new Set(["COMPLETED", "FAILED", "CANCELLED", "EXPIRED"]);
			if (terminalStatuses.has(job.status)) {
				request.log.debug({ messageId, status: job.status }, "Job already terminal, ACKing");
				return reply.send({ ack: true });
			}

			// 3. Update status to PROCESSING. Composite PK on the partitioned
			// table — pin to a single partition by including createdAt.
			await db
				.update(dispatchJobs)
				.set({ status: "PROCESSING", updatedAt: new Date() })
				.where(
					and(
						eq(dispatchJobs.id, messageId),
						eq(dispatchJobs.createdAt, job.createdAt),
					),
				);

			// 4. Deliver the webhook
			const attemptNumber = (job.attemptCount ?? 0) + 1;
			const startTime = Date.now();

			let ack = false;
			let newStatus: string = "PENDING";
			let responseCode: number | null = null;
			let errorMessage: string | null = null;
			let errorType: DispatchErrorType | null = null;
			let responseBody: string | null = null;

			try {
				// Build payload
				let body: string;
				if (job.dataOnly) {
					body = job.payload ?? "";
				} else {
					body = JSON.stringify({
						id: job.id,
						type: job.code,
						source: job.source,
						subject: job.subject,
						data: job.payload ? tryParseJson(job.payload) : null,
						correlationId: job.correlationId,
						messageGroup: job.messageGroup,
						clientId: job.clientId,
						attemptNumber,
					});
				}

				const controller = new AbortController();
				const timeout = setTimeout(
					() => controller.abort(),
					(job.timeoutSeconds ?? 30) * 1000,
				);

				const response = await fetch(job.targetUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Dispatch-Job-Id": messageId,
						"X-Event-Type": job.code,
					},
					body,
					signal: controller.signal,
				});

				clearTimeout(timeout);

				const statusCode = response.status;
				responseCode = statusCode;
				responseBody = await response.text();
				const durationMs = Date.now() - startTime;

				if (statusCode >= 200 && statusCode < 300) {
					// Check for explicit ack=false (deferred)
					const parsed = tryParseJson(responseBody);
					if (parsed && typeof parsed === "object" && "ack" in parsed && parsed.ack === false) {
						request.log.info({ messageId }, "Webhook deferred (ack=false)");
						newStatus = "PENDING";
						ack = false;
					} else {
						request.log.debug({ messageId, statusCode }, "Webhook delivered successfully");
						newStatus = "COMPLETED";
						ack = true;
					}
				} else if (statusCode === 429) {
					request.log.warn({ messageId }, "Webhook rate limited (429)");
					newStatus = "PENDING";
					errorMessage = "Rate limited";
					errorType = "HTTP_ERROR";
					ack = false;
				} else if (statusCode >= 400 && statusCode < 500) {
					request.log.warn({ messageId, statusCode }, "Webhook rejected (4xx)");
					const shouldFail = attemptNumber >= (job.maxRetries ?? 3);
					newStatus = shouldFail ? "FAILED" : "PENDING";
					errorMessage = `HTTP ${statusCode}`;
					errorType = "HTTP_ERROR";
					ack = shouldFail;
				} else {
					request.log.warn({ messageId, statusCode }, "Webhook server error (5xx)");
					const shouldFail = attemptNumber >= (job.maxRetries ?? 3);
					newStatus = shouldFail ? "FAILED" : "PENDING";
					errorMessage = `HTTP ${statusCode}`;
					errorType = "HTTP_ERROR";
					ack = shouldFail;
				}

				// 5. Record attempt
				await recordAttempt(db, {
					dispatchJobId: messageId,
					attemptNumber,
					status: newStatus === "COMPLETED" ? "SUCCESS" : "FAILED",
					responseCode,
					responseBody,
					errorMessage,
					errorType,
					durationMillis: durationMs,
				});

				// 6. Update dispatch job
				await updateJobAfterAttempt(db, messageId, job.createdAt, {
					status: newStatus,
					attemptCount: attemptNumber,
					durationMillis: durationMs,
					lastError: errorMessage,
				});
			} catch (err) {
				const durationMs = Date.now() - startTime;
				const isAbort = err instanceof Error && err.name === "AbortError";

				if (isAbort) {
					errorMessage = "Connection timeout";
					errorType = "TIMEOUT";
				} else if (err instanceof TypeError && String(err.message).includes("fetch")) {
					errorMessage = `Connection error: ${err.message}`;
					errorType = "CONNECTION";
				} else {
					errorMessage = err instanceof Error ? err.message : String(err);
					errorType = "UNKNOWN";
				}

				request.log.warn({ messageId, error: errorMessage }, "Webhook delivery failed");

				const shouldFail = attemptNumber >= (job.maxRetries ?? 3);
				newStatus = shouldFail ? "FAILED" : "PENDING";
				ack = shouldFail;

				await recordAttempt(db, {
					dispatchJobId: messageId,
					attemptNumber,
					status: "FAILED",
					responseCode: null,
					responseBody: null,
					errorMessage,
					errorType,
					errorStackTrace: err instanceof Error ? err.stack ?? null : null,
					durationMillis: durationMs,
				});

				await updateJobAfterAttempt(db, messageId, job.createdAt, {
					status: newStatus,
					attemptCount: attemptNumber,
					durationMillis: durationMs,
					lastError: errorMessage,
				});
			}

			return errorMessage != null ? { ack, message: errorMessage } : { ack };
		},
	);
}

// ── Helpers ─────────────────────────────────────────────────────────────

function tryParseJson(str: string): unknown {
	try {
		return JSON.parse(str);
	} catch {
		return null;
	}
}

interface AttemptRecord {
	dispatchJobId: string;
	attemptNumber: number;
	status: string;
	responseCode: number | null;
	responseBody: string | null;
	errorMessage: string | null;
	errorType: DispatchErrorType | null;
	errorStackTrace?: string | null;
	durationMillis: number;
}

async function recordAttempt(
	db: PostgresJsDatabase,
	attempt: AttemptRecord,
): Promise<void> {
	const now = new Date();
	await db.insert(dispatchJobAttempts).values({
		id: generateRaw(),
		dispatchJobId: attempt.dispatchJobId,
		attemptNumber: attempt.attemptNumber,
		status: attempt.status,
		responseCode: attempt.responseCode,
		responseBody: attempt.responseBody,
		errorMessage: attempt.errorMessage,
		errorType: attempt.errorType ?? undefined,
		errorStackTrace: attempt.errorStackTrace ?? undefined,
		durationMillis: attempt.durationMillis,
		attemptedAt: now,
		completedAt: now,
		createdAt: now,
	});
}

interface JobUpdate {
	status: string;
	attemptCount: number;
	durationMillis: number;
	lastError: string | null;
}

async function updateJobAfterAttempt(
	db: PostgresJsDatabase,
	jobId: string,
	jobCreatedAt: Date,
	update: JobUpdate,
): Promise<void> {
	const now = new Date();
	const isTerminal = ["COMPLETED", "FAILED", "CANCELLED", "EXPIRED"].includes(
		update.status,
	);

	// The UPDATE bumps `updated_at`; the dispatch-job projector picks the
	// row up on its next poll via `updated_at > projected_at`.
	await db
		.update(dispatchJobs)
		.set({
			status: update.status as "PENDING" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED",
			attemptCount: update.attemptCount,
			lastAttemptAt: now,
			durationMillis: update.durationMillis,
			lastError: update.lastError,
			completedAt: isTerminal ? now : undefined,
			updatedAt: now,
		})
		.where(
			and(
				eq(dispatchJobs.id, jobId),
				eq(dispatchJobs.createdAt, jobCreatedAt),
			),
		);
}
