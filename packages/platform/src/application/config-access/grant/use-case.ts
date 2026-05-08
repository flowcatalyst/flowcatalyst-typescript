/**
 * Grant Platform Config Access Use Case
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { PlatformConfigAccessRepository } from "../../../infrastructure/persistence/index.js";
import {
	createPlatformConfigAccess,
	PlatformConfigAccessGranted,
} from "../../../domain/index.js";

import type { GrantPlatformConfigAccessCommand } from "./command.js";

export interface GrantPlatformConfigAccessUseCaseDeps {
	readonly platformConfigAccessRepository: PlatformConfigAccessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createGrantPlatformConfigAccessUseCase(
	deps: GrantPlatformConfigAccessUseCaseDeps,
): UseCase<GrantPlatformConfigAccessCommand, PlatformConfigAccessGranted> {
	const { platformConfigAccessRepository, unitOfWork } = deps;

	return {
		async execute(
			command: GrantPlatformConfigAccessCommand,
			context: ExecutionContext,
		): Promise<Result<PlatformConfigAccessGranted>> {
			const appResult = validateRequired(
				command.applicationCode,
				"applicationCode",
				"APPLICATION_CODE_REQUIRED",
			);
			if (Result.isFailure(appResult)) return appResult;

			const roleResult = validateRequired(
				command.roleCode,
				"roleCode",
				"ROLE_CODE_REQUIRED",
			);
			if (Result.isFailure(roleResult)) return roleResult;

			const existing =
				await platformConfigAccessRepository.findByApplicationAndRole(
					command.applicationCode,
					command.roleCode,
				);
			if (existing) {
				return Result.failure(
					UseCaseError.businessRule(
						"GRANT_EXISTS",
						`Access grant already exists for role: ${command.roleCode}`,
					),
				);
			}

			const entity = createPlatformConfigAccess({
				applicationCode: command.applicationCode,
				roleCode: command.roleCode,
				canRead: command.canRead ?? true,
				canWrite: command.canWrite ?? false,
			});

			const event = new PlatformConfigAccessGranted(context, {
				grantId: entity.id,
				applicationCode: entity.applicationCode,
				roleCode: entity.roleCode,
				canRead: entity.canRead,
				canWrite: entity.canWrite,
			});

			return unitOfWork.commitOperations(event, command, async (tx) => {
				await platformConfigAccessRepository.insert(
					entity,
					tx as TransactionContext,
				);
			});
		},
	};
}
