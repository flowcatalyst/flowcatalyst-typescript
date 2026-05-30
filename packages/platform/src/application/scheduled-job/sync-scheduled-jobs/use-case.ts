/**
 * Sync ScheduledJobs Use Case
 *
 * Idempotent SDK-driven sync of scheduled job definitions for a given
 * client scope. Creates missing jobs, updates existing ones, and
 * re-activates listed jobs that had been paused/archived. When
 * `archiveUnlisted` is set, ACTIVE jobs in the scope absent from the
 * payload are archived (off by default — sync is otherwise additive).
 * Mirrors Rust scheduled_job/operations/sync.rs.
 */

import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import {
	createScheduledJob,
	updateScheduledJob,
	archiveScheduledJob,
	ScheduledJobsSynced,
} from "../../../domain/index.js";
import {
	validateCrons,
	CronEvaluationError,
} from "../../../scheduled-job-scheduler/index.js";

import type { SyncScheduledJobsCommand } from "./command.js";

export interface SyncScheduledJobsUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createSyncScheduledJobsUseCase(
	deps: SyncScheduledJobsUseCaseDeps,
): UseCase<SyncScheduledJobsCommand, ScheduledJobsSynced> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: SyncScheduledJobsCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobsSynced>> {
			// Pre-validate all crons before opening the transaction.
			for (const item of command.scheduledJobs) {
				if (!item.crons || item.crons.length === 0) {
					return Result.failure(
						UseCaseError.validation(
							"CRONS_REQUIRED",
							`Cron expressions are required for code '${item.code}'`,
						),
					);
				}
				try {
					validateCrons(item.crons, item.timezone ?? "UTC");
				} catch (err) {
					if (err instanceof CronEvaluationError) {
						return Result.failure(
							UseCaseError.validation(
								"INVALID_CRON_OR_TIMEZONE",
								`${item.code}: ${err.message}`,
							),
						);
					}
					throw err;
				}
			}

			// Mutable counters wrapped in the event's data object so the
			// `created`/`updated` fields reflect the actual totals once the
			// transaction completes. UoW serialises `data` after the
			// operations callback returns, so in-place mutation is safe.
			const eventData = {
				clientId: command.clientId,
				synced: command.scheduledJobs.length,
				created: 0,
				updated: 0,
				archived: 0,
			};

			// Codes present in this sync payload — used to detect unlisted jobs
			// when archiveUnlisted is set.
			const syncedCodes = new Set(
				command.scheduledJobs.map((j) => j.code),
			);
			const event = new ScheduledJobsSynced(context, eventData);

			const result = await unitOfWork.commitOperations(
				event,
				command,
				async (tx) => {
					const txCtx = tx as TransactionContext;
					for (const item of command.scheduledJobs) {
						const existing = await scheduledJobRepository.findByCode(
							command.clientId,
							item.code,
							txCtx,
						);
						if (!existing) {
							const job = createScheduledJob({
								clientId: command.clientId,
								code: item.code,
								name: item.name,
								description: item.description ?? null,
								crons: item.crons,
								timezone: item.timezone ?? "UTC",
								payload: item.payload ?? null,
								concurrent: item.concurrent ?? false,
								tracksCompletion: item.tracksCompletion ?? false,
								timeoutSeconds: item.timeoutSeconds ?? null,
								deliveryMaxAttempts: item.deliveryMaxAttempts ?? 3,
								targetUrl: item.targetUrl ?? null,
								createdBy: context.principalId ?? null,
							});
							await scheduledJobRepository.insert(job, txCtx);
							eventData.created++;
						} else {
							const updatedEntity = updateScheduledJob(existing, {
								name: item.name,
								description: item.description ?? null,
								crons: item.crons,
								timezone: item.timezone ?? existing.timezone,
								payload: item.payload ?? null,
								concurrent: item.concurrent ?? existing.concurrent,
								tracksCompletion:
									item.tracksCompletion ?? existing.tracksCompletion,
								timeoutSeconds: item.timeoutSeconds ?? existing.timeoutSeconds,
								deliveryMaxAttempts:
									item.deliveryMaxAttempts ?? existing.deliveryMaxAttempts,
								targetUrl: item.targetUrl ?? existing.targetUrl,
								updatedBy: context.principalId ?? null,
							});
							// Sync re-activates archived/paused jobs that reappear
							// in the payload — that's the contract. Matches Rust
							// scheduled_job/operations/sync.rs:182-187.
							const reactivated =
								updatedEntity.status === "ACTIVE"
									? updatedEntity
									: { ...updatedEntity, status: "ACTIVE" as const };
							await scheduledJobRepository.update(reactivated, txCtx);
							eventData.updated++;
						}
					}

					// Optionally archive jobs in this scope that are absent from
					// the payload. Off by default (additive sync); when set, only
					// ACTIVE unlisted jobs are archived. Matches Rust
					// scheduled_job/operations/sync.rs:222-231.
					if (command.archiveUnlisted) {
						const scoped = await scheduledJobRepository.findByClientScope(
							command.clientId,
							txCtx,
						);
						for (const job of scoped) {
							if (job.status === "ACTIVE" && !syncedCodes.has(job.code)) {
								await scheduledJobRepository.update(
									archiveScheduledJob(job),
									txCtx,
								);
								eventData.archived++;
							}
						}
					}
				},
			);

			return result;
		},
	};
}
