/**
 * Scheduled-Job Scheduler
 *
 * Runs two cooperating background tasks:
 *   * Poller     — every pollIntervalMs, scans ACTIVE jobs, computes the
 *                  latest cron slot in (lastFiredAt, now] per job, and
 *                  inserts a QUEUED instance row for it (skip-missed).
 *   * Dispatcher — every dispatchIntervalMs, drains QUEUED instances, POSTs
 *                  each to the job's targetUrl, and marks the instance
 *                  DELIVERED / DELIVERY_FAILED (with retry-until-max).
 *
 * Single-replica assumption for v1.
 */

import type {
	ScheduledJobRepository,
	ScheduledJobInstanceRepository,
} from "../infrastructure/persistence/index.js";
import {
	type ScheduledJobSchedulerConfig,
	type ScheduledJobSchedulerLogger,
	DEFAULT_SCHEDULED_JOB_SCHEDULER_CONFIG,
} from "./config.js";
import { createScheduledJobPoller } from "./poller.js";
import { createScheduledJobDispatcher } from "./dispatcher.js";

export interface ScheduledJobSchedulerDeps {
	readonly repo: ScheduledJobRepository;
	readonly instanceRepo: ScheduledJobInstanceRepository;
	readonly logger: ScheduledJobSchedulerLogger;
	readonly config?: Partial<ScheduledJobSchedulerConfig> | undefined;
}

export interface ScheduledJobSchedulerHandle {
	stop(): void;
}

export function startScheduledJobScheduler(
	deps: ScheduledJobSchedulerDeps,
): ScheduledJobSchedulerHandle {
	const config: ScheduledJobSchedulerConfig = {
		...DEFAULT_SCHEDULED_JOB_SCHEDULER_CONFIG,
		...deps.config,
	};

	const { repo, instanceRepo, logger } = deps;

	const poller = createScheduledJobPoller(config, repo, instanceRepo, logger);
	const dispatcher = createScheduledJobDispatcher(
		config,
		repo,
		instanceRepo,
		logger,
	);

	poller.start();
	dispatcher.start();

	logger.info("Scheduled-Job Scheduler started");

	return {
		stop() {
			poller.stop();
			dispatcher.stop();
			logger.info("Scheduled-Job Scheduler stopped");
		},
	};
}

export {
	type ScheduledJobSchedulerConfig,
	type ScheduledJobSchedulerLogger,
	DEFAULT_SCHEDULED_JOB_SCHEDULER_CONFIG,
} from "./config.js";
export {
	latestSlotInWindow,
	validateCrons,
	CronEvaluationError,
} from "./cron-utils.js";
