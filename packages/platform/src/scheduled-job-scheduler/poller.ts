/**
 * Cron-tick poller.
 *
 * On each `pollIntervalMs`:
 *   1. Load every ACTIVE ScheduledJob (small set — definitions, not firings).
 *   2. For each, compute the LATEST cron slot in (lastFiredAt, now].
 *   3. If a slot exists, insert a QUEUED instance row for it and bump
 *      lastFiredAt to that slot. The dispatcher picks it up next.
 *
 * Skip-missed semantics: when multiple slots fall in the window after a long
 * downtime, only the LATEST fires. `lastFiredAt` advances to the latest fire.
 *
 * Single-replica assumption — concurrent pollers would double-fire slots.
 * Add `SELECT ... FOR UPDATE SKIP LOCKED` claims when scaling out.
 */

import type {
	ScheduledJobRepository,
	ScheduledJobInstanceRepository,
} from "../infrastructure/persistence/index.js";
import type {
	ScheduledJobSchedulerConfig,
	ScheduledJobSchedulerLogger,
} from "./config.js";
import type { ScheduledJob } from "../domain/index.js";
import { latestSlotInWindow } from "./cron-utils.js";

export interface ScheduledJobPoller {
	start(): void;
	stop(): void;
}

export function createScheduledJobPoller(
	config: ScheduledJobSchedulerConfig,
	repo: ScheduledJobRepository,
	instanceRepo: ScheduledJobInstanceRepository,
	logger: ScheduledJobSchedulerLogger,
): ScheduledJobPoller {
	let timer: ReturnType<typeof setInterval> | null = null;
	let running = false;

	async function processJob(
		job: ScheduledJob,
		now: Date,
	): Promise<boolean> {
		const after = job.lastFiredAt ?? job.createdAt;
		let slot: Date | null;
		try {
			slot = latestSlotInWindow(job.crons, job.timezone, after, now);
		} catch (err) {
			logger.warn(
				{ err, jobId: job.id, crons: job.crons, tz: job.timezone },
				"Invalid cron/timezone for scheduled job; skipping",
			);
			return false;
		}
		if (!slot) return false;

		await instanceRepo.insert({
			scheduledJobId: job.id,
			clientId: job.clientId,
			jobCode: job.code,
			triggerKind: "CRON",
			scheduledFor: slot,
			firedAt: now,
		});
		await repo.markFired(job.id, slot);
		logger.debug(
			{ jobId: job.id, slot: slot.toISOString() },
			"Cron-fired scheduled job",
		);
		return true;
	}

	async function tick(): Promise<void> {
		if (!running) return;
		const now = new Date();
		try {
			const jobs = await repo.findActiveForPolling();
			logger.debug(
				{ count: jobs.length },
				"Polling active scheduled jobs",
			);

			let fired = 0;
			let errors = 0;
			for (const job of jobs) {
				try {
					if (await processJob(job, now)) fired++;
				} catch (err) {
					errors++;
					logger.warn(
						{ err, jobId: job.id },
						"Failed to evaluate scheduled job",
					);
				}
			}
			if (fired > 0 || errors > 0) {
				logger.info({ fired, errors }, "Scheduled-job poll completed");
			}
		} catch (err) {
			logger.error({ err }, "Scheduled-job poller tick failed");
		}
	}

	return {
		start(): void {
			if (running) return;
			running = true;
			// Run once immediately so dev/test sees a fast first tick.
			void tick();
			timer = setInterval(() => {
				void tick();
			}, config.pollIntervalMs);
			logger.info(
				{ intervalMs: config.pollIntervalMs },
				"Scheduled-job poller started",
			);
		},
		stop(): void {
			if (!running) return;
			running = false;
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			logger.info("Scheduled-job poller stopped");
		},
	};
}
