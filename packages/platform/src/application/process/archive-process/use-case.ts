/**
 * Archive Process Use Case
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	Result,
	UseCaseError,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ProcessRepository } from "../../../infrastructure/persistence/index.js";
import { archiveProcess, ProcessArchived } from "../../../domain/index.js";

import type { ArchiveProcessCommand } from "./command.js";

export interface ArchiveProcessUseCaseDeps {
	readonly processRepository: ProcessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createArchiveProcessUseCase(
	deps: ArchiveProcessUseCaseDeps,
): UseCase<ArchiveProcessCommand, ProcessArchived> {
	const { processRepository, unitOfWork } = deps;

	return {
		async execute(
			command: ArchiveProcessCommand,
			context: ExecutionContext,
		): Promise<Result<ProcessArchived>> {
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

			if (existing.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"ALREADY_ARCHIVED",
						"Process is already archived",
					),
				);
			}

			const archived = archiveProcess(existing);

			const event = new ProcessArchived(context, {
				processId: archived.id,
				code: archived.code,
			});

			return unitOfWork.commit(archived, event, command);
		},
	};
}
