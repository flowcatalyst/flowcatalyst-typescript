/**
 * Delete Platform Config Use Case.
 *
 * Deletes the row matching (applicationCode, section, property, scope,
 * clientId). Returns NOT_FOUND if no row exists; otherwise emits
 * PlatformConfigDeleted inside the UoW.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { PlatformConfigRepository } from "../../../infrastructure/persistence/index.js";
import { PlatformConfigDeleted } from "../../../domain/index.js";

import type { DeletePlatformConfigCommand } from "./command.js";

export interface DeletePlatformConfigUseCaseDeps {
	readonly platformConfigRepository: PlatformConfigRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeletePlatformConfigUseCase(
	deps: DeletePlatformConfigUseCaseDeps,
): UseCase<DeletePlatformConfigCommand, PlatformConfigDeleted> {
	const { platformConfigRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeletePlatformConfigCommand,
			context: ExecutionContext,
		): Promise<Result<PlatformConfigDeleted>> {
			const existing = await platformConfigRepository.findByKey(
				command.applicationCode,
				command.section,
				command.property,
				command.scope,
				command.clientId,
			);
			if (!existing) {
				return Result.failure(
					UseCaseError.notFound(
						"PLATFORM_CONFIG_NOT_FOUND",
						`Config not found: ${command.applicationCode}.${command.section}.${command.property}`,
					),
				);
			}

			const event = new PlatformConfigDeleted(context, {
				applicationCode: command.applicationCode,
				section: command.section,
				property: command.property,
				scope: command.scope,
				clientId: command.clientId,
			});

			return unitOfWork.commitOperations(event, command, async (tx) => {
				await platformConfigRepository.deleteByKey(
					command.applicationCode,
					command.section,
					command.property,
					command.scope,
					command.clientId,
					tx as TransactionContext,
				);
			});
		},
	};
}
