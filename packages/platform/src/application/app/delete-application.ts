/**
 * Delete Application — command + use case in one file.
 *
 * Mirrors the Go port's per-operation file pattern
 * (flowcatalyst-go/internal/platform/application/operations/delete.go):
 * one operation per file, command interface above, use-case factory
 * below.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	Result,
	UseCaseError,
	validateRequired,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import { ApplicationDeleted } from "../../domain/index.js";
import type { ApplicationRepository } from "../../infrastructure/persistence/index.js";

export interface DeleteApplicationCommand extends Command {
	readonly applicationId: string;
}

export interface DeleteApplicationUseCaseDeps {
	readonly applicationRepository: ApplicationRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeleteApplicationUseCase(
	deps: DeleteApplicationUseCaseDeps,
): UseCase<DeleteApplicationCommand, ApplicationDeleted> {
	const { applicationRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteApplicationCommand,
			context: ExecutionContext,
		): Promise<Result<ApplicationDeleted>> {
			const idResult = validateRequired(
				command.applicationId,
				"applicationId",
				"APPLICATION_ID_REQUIRED",
			);
			if (Result.isFailure(idResult)) {
				return idResult;
			}

			const application = await applicationRepository.findById(
				command.applicationId,
			);
			if (!application) {
				return Result.failure(
					UseCaseError.notFound(
						"APPLICATION_NOT_FOUND",
						"Application not found",
					),
				);
			}

			const event = new ApplicationDeleted(context, {
				applicationId: application.id,
				code: application.code,
				name: application.name,
			});

			return unitOfWork.commitDelete(application, event, command);
		},
	};
}
