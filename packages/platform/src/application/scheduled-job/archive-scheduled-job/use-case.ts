import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import {
	archiveScheduledJob,
	ScheduledJobArchived,
} from "../../../domain/index.js";

import type { ArchiveScheduledJobCommand } from "./command.js";

export interface ArchiveScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createArchiveScheduledJobUseCase(
	deps: ArchiveScheduledJobUseCaseDeps,
): UseCase<ArchiveScheduledJobCommand, ScheduledJobArchived> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: ArchiveScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobArchived>> {
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
						"ALREADY_ARCHIVED",
						"Scheduled job is already archived",
					),
				);
			}

			const archived = archiveScheduledJob(job);
			const event = new ScheduledJobArchived(context, {
				scheduledJobId: archived.id,
				code: archived.code,
			});
			return unitOfWork.commit(archived, event, command);
		},
	};
}
