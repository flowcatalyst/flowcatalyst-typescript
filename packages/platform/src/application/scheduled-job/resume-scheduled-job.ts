/**
 * Resume ScheduledJob — command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../infrastructure/persistence/index.js";
import {
	resumeScheduledJob,
	ScheduledJobResumed,
} from "../../domain/index.js";

export interface ResumeScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
}

export interface ResumeScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createResumeScheduledJobUseCase(
	deps: ResumeScheduledJobUseCaseDeps,
): UseCase<ResumeScheduledJobCommand, ScheduledJobResumed> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: ResumeScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobResumed>> {
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
			if (job.status === "ACTIVE") {
				return Result.failure(
					UseCaseError.businessRule(
						"ALREADY_ACTIVE",
						"Scheduled job is already active",
					),
				);
			}
			if (job.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"ARCHIVED",
						"Cannot resume an archived scheduled job",
					),
				);
			}

			const resumed = resumeScheduledJob(job);
			const event = new ScheduledJobResumed(context, {
				scheduledJobId: resumed.id,
				code: resumed.code,
			});
			return unitOfWork.commit(resumed, event, command);
		},
	};
}
