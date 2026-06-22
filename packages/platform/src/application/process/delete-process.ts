/**
 * Delete Process — command + use case in one file.
 *
 * Only archived processes can be deleted.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	Result,
	UseCaseError,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ProcessRepository } from "../../infrastructure/persistence/index.js";
import { ProcessDeleted } from "../../domain/index.js";

export interface DeleteProcessCommand extends Command {
	readonly processId: string;
}

export interface DeleteProcessUseCaseDeps {
	readonly processRepository: ProcessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeleteProcessUseCase(
	deps: DeleteProcessUseCaseDeps,
): UseCase<DeleteProcessCommand, ProcessDeleted> {
	const { processRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteProcessCommand,
			context: ExecutionContext,
		): Promise<Result<ProcessDeleted>> {
			const existing = await processRepository.findById(command.processId);
			if (!existing) {
				return Result.failure(
					UseCaseError.notFound(
						"PROCESS_NOT_FOUND",
						`Process with ID '${command.processId}' not found`,
						{ processId: command.processId },
					),
				);
			}

			if (existing.status !== "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_DELETE",
						"Can only delete archived processes",
					),
				);
			}

			const event = new ProcessDeleted(context, {
				processId: existing.id,
				code: existing.code,
			});

			return unitOfWork.commitDelete(existing, event, command);
		},
	};
}
