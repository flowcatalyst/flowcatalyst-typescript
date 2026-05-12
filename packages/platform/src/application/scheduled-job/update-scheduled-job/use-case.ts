import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import {
	updateScheduledJob,
	ScheduledJobUpdated,
} from "../../../domain/index.js";
import { validateCrons, CronEvaluationError } from "../../../scheduled-job-scheduler/index.js";

import type { UpdateScheduledJobCommand } from "./command.js";

export interface UpdateScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdateScheduledJobUseCase(
	deps: UpdateScheduledJobUseCaseDeps,
): UseCase<UpdateScheduledJobCommand, ScheduledJobUpdated> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: UpdateScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobUpdated>> {
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
						"Cannot update an archived scheduled job",
					),
				);
			}

			if (command.crons !== undefined) {
				if (command.crons.length === 0) {
					return Result.failure(
						UseCaseError.validation(
							"CRONS_REQUIRED",
							"At least one cron expression is required",
						),
					);
				}
				const tz = command.timezone ?? job.timezone;
				try {
					validateCrons(command.crons, tz);
				} catch (err) {
					if (err instanceof CronEvaluationError) {
						return Result.failure(
							UseCaseError.validation("INVALID_CRON_OR_TIMEZONE", err.message),
						);
					}
					throw err;
				}
			}

			const updated = updateScheduledJob(job, {
				name: command.name,
				description: command.description,
				crons: command.crons,
				timezone: command.timezone,
				payload: command.payload,
				concurrent: command.concurrent,
				tracksCompletion: command.tracksCompletion,
				timeoutSeconds: command.timeoutSeconds,
				deliveryMaxAttempts: command.deliveryMaxAttempts,
				targetUrl: command.targetUrl,
				updatedBy: context.principalId ?? null,
			});

			const event = new ScheduledJobUpdated(context, {
				scheduledJobId: updated.id,
				code: updated.code,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
