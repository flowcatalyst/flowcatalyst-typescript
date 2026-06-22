/**
 * Delete CORS Origin — command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { CorsAllowedOriginRepository } from "../../infrastructure/persistence/index.js";
import { CorsOriginDeleted } from "../../domain/index.js";

export interface DeleteCorsOriginCommand extends Command {
	readonly originId: string;
}

export interface DeleteCorsOriginUseCaseDeps {
	readonly corsAllowedOriginRepository: CorsAllowedOriginRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeleteCorsOriginUseCase(
	deps: DeleteCorsOriginUseCaseDeps,
): UseCase<DeleteCorsOriginCommand, CorsOriginDeleted> {
	const { corsAllowedOriginRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteCorsOriginCommand,
			context: ExecutionContext,
		): Promise<Result<CorsOriginDeleted>> {
			// Validate ID
			const idResult = validateRequired(
				command.originId,
				"originId",
				"ORIGIN_ID_REQUIRED",
			);
			if (Result.isFailure(idResult)) {
				return idResult;
			}

			// Find origin
			const origin = await corsAllowedOriginRepository.findById(
				command.originId,
			);
			if (!origin) {
				return Result.failure(
					UseCaseError.notFound(
						"CORS_ORIGIN_NOT_FOUND",
						"CORS origin not found",
					),
				);
			}

			// Create event
			const event = new CorsOriginDeleted(context, {
				originId: origin.id,
				origin: origin.origin,
			});

			return unitOfWork.commitDelete(origin, event, command);
		},
	};
}
