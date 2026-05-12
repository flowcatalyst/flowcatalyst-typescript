import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import {
	pauseScheduledJob,
	ScheduledJobPaused,
} from "../../../domain/index.js";

import type { PauseScheduledJobCommand } from "./command.js";

export interface PauseScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createPauseScheduledJobUseCase(
	deps: PauseScheduledJobUseCaseDeps,
): UseCase<PauseScheduledJobCommand, ScheduledJobPaused> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: PauseScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobPaused>> {
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
			if (job.status === "PAUSED") {
				return Result.failure(
					UseCaseError.businessRule("ALREADY_PAUSED", "Already paused"),
				);
			}
			if (job.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"ARCHIVED",
						"Cannot pause an archived scheduled job",
					),
				);
			}

			const paused = pauseScheduledJob(job);
			const event = new ScheduledJobPaused(context, {
				scheduledJobId: paused.id,
				code: paused.code,
			});
			return unitOfWork.commit(paused, event, command);
		},
	};
}
