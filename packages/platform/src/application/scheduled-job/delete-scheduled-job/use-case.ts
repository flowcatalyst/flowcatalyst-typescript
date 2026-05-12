import type { UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { ScheduledJobRepository } from "../../../infrastructure/persistence/index.js";
import { ScheduledJobDeleted } from "../../../domain/index.js";

import type { DeleteScheduledJobCommand } from "./command.js";

export interface DeleteScheduledJobUseCaseDeps {
	readonly scheduledJobRepository: ScheduledJobRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeleteScheduledJobUseCase(
	deps: DeleteScheduledJobUseCaseDeps,
): UseCase<DeleteScheduledJobCommand, ScheduledJobDeleted> {
	const { scheduledJobRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteScheduledJobCommand,
			context: ExecutionContext,
		): Promise<Result<ScheduledJobDeleted>> {
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

			// Mirrors Rust semantics: history (instances + logs) survives — partition
			// retention sweeps drop them on age, not on parent-row existence.
			const event = new ScheduledJobDeleted(context, {
				scheduledJobId: job.id,
				code: job.code,
			});
			return unitOfWork.commitDelete(job, event, command);
		},
	};
}
