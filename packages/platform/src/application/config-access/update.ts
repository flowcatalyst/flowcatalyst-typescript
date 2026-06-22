/**
 * Update Platform Config Access — command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { PlatformConfigAccessRepository } from "../../infrastructure/persistence/index.js";
import { PlatformConfigAccessUpdated } from "../../domain/index.js";

export interface UpdatePlatformConfigAccessCommand extends Command {
	readonly applicationCode: string;
	readonly roleCode: string;
	readonly canRead?: boolean;
	readonly canWrite?: boolean;
}

export interface UpdatePlatformConfigAccessUseCaseDeps {
	readonly platformConfigAccessRepository: PlatformConfigAccessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdatePlatformConfigAccessUseCase(
	deps: UpdatePlatformConfigAccessUseCaseDeps,
): UseCase<UpdatePlatformConfigAccessCommand, PlatformConfigAccessUpdated> {
	const { platformConfigAccessRepository, unitOfWork } = deps;

	return {
		async execute(
			command: UpdatePlatformConfigAccessCommand,
			context: ExecutionContext,
		): Promise<Result<PlatformConfigAccessUpdated>> {
			const existing =
				await platformConfigAccessRepository.findByApplicationAndRole(
					command.applicationCode,
					command.roleCode,
				);
			if (!existing) {
				return Result.failure(
					UseCaseError.notFound(
						"GRANT_NOT_FOUND",
						`Access grant not found for role: ${command.roleCode}`,
					),
				);
			}

			const updated = {
				...existing,
				canRead: command.canRead ?? existing.canRead,
				canWrite: command.canWrite ?? existing.canWrite,
			};

			const event = new PlatformConfigAccessUpdated(context, {
				grantId: updated.id,
				applicationCode: updated.applicationCode,
				roleCode: updated.roleCode,
				canRead: updated.canRead,
				canWrite: updated.canWrite,
			});

			return unitOfWork.commitOperations(event, command, async (tx) => {
				await platformConfigAccessRepository.update(
					updated,
					tx as TransactionContext,
				);
			});
		},
	};
}
