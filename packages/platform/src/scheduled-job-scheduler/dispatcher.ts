/**
 * Scheduled-job webhook dispatcher.
 *
 * Drains QUEUED ScheduledJobInstance rows, POSTs the envelope to the owning
 * job's targetUrl, and transitions each instance to DELIVERED or
 * DELIVERY_FAILED. Retry on transient failure is implicit: a non-202
 * response sets the instance back to QUEUED for the next tick — until
 * deliveryMaxAttempts is reached, then the instance is marked
 * DELIVERY_FAILED (terminal).
 *
 * All writes here bypass UoW (infrastructure path).
 */

import type {
	ScheduledJob,
	ScheduledJobInstance,
} from "../domain/index.js";
import type {
	ScheduledJobRepository,
	ScheduledJobInstanceRepository,
} from "../infrastructure/persistence/index.js";
import type {
	ScheduledJobSchedulerConfig,
	ScheduledJobSchedulerLogger,
} from "./config.js";

export interface ScheduledJobDispatcher {
	start(): void;
	stop(): void;
}

interface WebhookEnvelope {
	jobId: string;
	jobCode: string;
	instanceId: string;
	scheduledFor: string | null;
	firedAt: string;
	triggerKind: string;
	correlationId?: string;
	payload?: unknown;
	tracksCompletion: boolean;
	timeoutSeconds?: number;
}

export function createScheduledJobDispatcher(
	config: ScheduledJobSchedulerConfig,
	repo: ScheduledJobRepository,
	instanceRepo: ScheduledJobInstanceRepository,
	logger: ScheduledJobSchedulerLogger,
): ScheduledJobDispatcher {
	let timer: ReturnType<typeof setInterval> | null = null;
	let running = false;

	async function handleFailure(
		job: ScheduledJob,
		inst: ScheduledJobInstance,
		attemptsAfterInc: number,
		error: string,
	): Promise<"failed" | "requeued"> {
		const terminal = attemptsAfterInc >= job.deliveryMaxAttempts;
		try {
			await instanceRepo.markDeliveryFailed(
				inst.id,
				inst.createdAt,
				error,
				terminal,
			);
		} catch (err) {
			logger.error(
				{ err, instanceId: inst.id },
				"Failed to record delivery failure",
			);
			return "failed";
		}
		if (terminal) {
			logger.warn(
				{
					instanceId: inst.id,
					attempts: attemptsAfterInc,
					max: job.deliveryMaxAttempts,
					error,
				},
				"Scheduled-job delivery exhausted retries",
			);
			return "failed";
		}
		logger.debug(
			{
				instanceId: inst.id,
				attempts: attemptsAfterInc,
				max: job.deliveryMaxAttempts,
				error,
			},
			"Scheduled-job delivery failed; requeued",
		);
		return "requeued";
	}

	async function dispatchOne(
		job: ScheduledJob,
		inst: ScheduledJobInstance,
	): Promise<"delivered" | "failed" | "requeued"> {
		if (!job.targetUrl) {
			logger.warn(
				{ jobId: job.id, instanceId: inst.id },
				"ScheduledJob has no targetUrl; marking instance DELIVERY_FAILED",
			);
			try {
				await instanceRepo.markDeliveryFailed(
					inst.id,
					inst.createdAt,
					"No targetUrl configured",
					true,
				);
			} catch (err) {
				logger.error(
					{ err, instanceId: inst.id },
					"Failed to mark DELIVERY_FAILED",
				);
			}
			return "failed";
		}

		try {
			await instanceRepo.markInFlight(inst.id, inst.createdAt);
		} catch (err) {
			logger.error(
				{ err, instanceId: inst.id },
				"Failed to mark instance IN_FLIGHT",
			);
			return "failed";
		}

		const envelope: WebhookEnvelope = {
			jobId: job.id,
			jobCode: job.code,
			instanceId: inst.id,
			scheduledFor: inst.scheduledFor ? inst.scheduledFor.toISOString() : null,
			firedAt: inst.firedAt.toISOString(),
			triggerKind: inst.triggerKind,
			tracksCompletion: job.tracksCompletion,
			...(inst.correlationId ? { correlationId: inst.correlationId } : {}),
			...(job.payload !== null && job.payload !== undefined
				? { payload: job.payload }
				: {}),
			...(job.timeoutSeconds !== null && job.timeoutSeconds !== undefined
				? { timeoutSeconds: job.timeoutSeconds }
				: {}),
		};

		const attemptsAfterInc = inst.deliveryAttempts + 1;
		const controller = new AbortController();
		const timeoutHandle = setTimeout(
			() => controller.abort(),
			config.httpTimeoutMs,
		);

		try {
			const response = await fetch(job.targetUrl, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(envelope),
				signal: controller.signal,
			});

			if (response.status === 202) {
				try {
					await instanceRepo.markDelivered(inst.id, inst.createdAt);
				} catch (err) {
					logger.error(
						{ err, instanceId: inst.id },
						"Failed to mark DELIVERED",
					);
					return "failed";
				}
				return "delivered";
			}

			const body = await response.text().catch(() => "");
			const truncated = body.slice(0, 500);
			return handleFailure(
				job,
				inst,
				attemptsAfterInc,
				`HTTP ${response.status} (expected 202): ${truncated}`,
			);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			return handleFailure(job, inst, attemptsAfterInc, `Network/HTTP error: ${msg}`);
		} finally {
			clearTimeout(timeoutHandle);
		}
	}

	async function tick(): Promise<void> {
		if (!running) return;
		try {
			const instances = await instanceRepo.list({
				status: "QUEUED",
				limit: config.dispatchBatchSize,
			});

			if (instances.length === 0) return;
			logger.debug(
				{ count: instances.length },
				"Dispatching queued scheduled-job instances",
			);

			// Batch-load jobs to avoid N+1
			const jobCache = new Map<string, ScheduledJob | undefined>();
			for (const inst of instances) {
				if (!jobCache.has(inst.scheduledJobId)) {
					jobCache.set(
						inst.scheduledJobId,
						await repo.findById(inst.scheduledJobId),
					);
				}
			}

			let delivered = 0;
			let failed = 0;
			let requeued = 0;
			for (const inst of instances) {
				const job = jobCache.get(inst.scheduledJobId);
				if (!job) {
					// Job deleted between insert and dispatch.
					try {
						await instanceRepo.markDeliveryFailed(
							inst.id,
							inst.createdAt,
							"ScheduledJob no longer exists",
							true,
						);
					} catch (err) {
						logger.error(
							{ err, instanceId: inst.id },
							"Failed to mark orphan instance DELIVERY_FAILED",
						);
					}
					failed++;
					continue;
				}
				const outcome = await dispatchOne(job, inst);
				if (outcome === "delivered") delivered++;
				else if (outcome === "failed") failed++;
				else requeued++;
			}
			if (delivered > 0 || failed > 0 || requeued > 0) {
				logger.info(
					{ delivered, failed, requeued },
					"Scheduled-job dispatch tick completed",
				);
			}
		} catch (err) {
			logger.error({ err }, "Scheduled-job dispatcher tick failed");
		}
	}

	return {
		start(): void {
			if (running) return;
			running = true;
			timer = setInterval(() => {
				void tick();
			}, config.dispatchIntervalMs);
			logger.info(
				{
					intervalMs: config.dispatchIntervalMs,
					batchSize: config.dispatchBatchSize,
				},
				"Scheduled-job dispatcher started",
			);
		},
		stop(): void {
			if (!running) return;
			running = false;
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			logger.info("Scheduled-job dispatcher stopped");
		},
	};
}
