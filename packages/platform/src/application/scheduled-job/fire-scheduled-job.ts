/**
 * Fire ScheduledJob — command + use case in one file.
 *
 * Manually fire a ScheduledJob right now.
 *
 * Two-phase write: first inserts the instance row directly (platform-
 * infrastructure path, no UoW), then emits a `ScheduledJobFired` domain event
 * via the UoW for the audit trail. Order matters — if the infrastructure
 * insert fails, no audit row is written; if the audit emit fails, the
 * instance still exists and the dispatcher will deliver it.
 *
 * The actual webhook delivery happens asynchronously via the dispatcher.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type {
	ScheduledJobRepository,
	ScheduledJobInstanceRepository,
} from "../../infrastructure/persistence/index.js";
import { ScheduledJobFired } from "../../domain/index.js";

export interface FireScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
	/** Optional correlation id stamped on the resulting instance for tracing. */
	readonly correlationId?: string | null | undefined;
}

export interface FireScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly scheduledJobInstanceRepository: ScheduledJobInstanceRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createFireScheduledJobUseCase(
	deps: FireScheduledJobUseCaseDeps,
): UseCase<FireScheduledJobCommand, ScheduledJobFired> {
	const { scheduledJobRepository, scheduledJobInstanceRepository, unitOfWork } =
		deps;

	return {
		async execute(
			command: FireScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobFired>> {
			const job = await scheduledJobRepository.findById(command.scheduledJobId);
			if (!job) {
				return Result.failure(
					UseCaseError.notFound(
						"SCHEDULED_JOB_NOT_FOUND",
						"Scheduled job not found",
						{ scheduledJobId: command.scheduledJobId },
					),
				);
			}

			if (job.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"ARCHIVED",
						"Cannot fire an archived scheduled job",
					),
				);
			}
			// PAUSED is still firable manually — that's the whole point of a manual
			// trigger. The poller skips PAUSED; humans can override.

			const now = new Date();
			const instance = await scheduledJobInstanceRepository.insert({
				scheduledJobId: job.id,
				clientId: job.clientId,
				jobCode: job.code,
				triggerKind: "MANUAL",
				scheduledFor: null,
				firedAt: now,
				correlationId: command.correlationId ?? null,
			});

			const event = new ScheduledJobFired(context, {
				scheduledJobId: job.id,
				code: job.code,
				instanceId: instance.id,
			});

			return unitOfWork.commitOperations(event, command, async () => {
				// No additional persistence — the instance was written outside the
				// UoW transaction on the infrastructure path. We only emit the event.
			});
		},
	};
}
