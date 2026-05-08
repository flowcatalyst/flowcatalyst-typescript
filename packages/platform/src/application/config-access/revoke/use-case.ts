/**
 * Revoke Platform Config Access Use Case
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { PlatformConfigAccessRepository } from "../../../infrastructure/persistence/index.js";
import { PlatformConfigAccessRevoked } from "../../../domain/index.js";

import type { RevokePlatformConfigAccessCommand } from "./command.js";

export interface RevokePlatformConfigAccessUseCaseDeps {
	readonly platformConfigAccessRepository: PlatformConfigAccessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createRevokePlatformConfigAccessUseCase(
	deps: RevokePlatformConfigAccessUseCaseDeps,
): UseCase<RevokePlatformConfigAccessCommand, PlatformConfigAccessRevoked> {
	const { platformConfigAccessRepository, unitOfWork } = deps;

	return {
		async execute(
			command: RevokePlatformConfigAccessCommand,
			context: ExecutionContext,
		): Promise<Result<PlatformConfigAccessRevoked>> {
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

			const event = new PlatformConfigAccessRevoked(context, {
				applicationCode: command.applicationCode,
				roleCode: command.roleCode,
			});

			return unitOfWork.commitOperations(event, command, async (tx) => {
				await platformConfigAccessRepository.deleteByApplicationAndRole(
					command.applicationCode,
					command.roleCode,
					tx as TransactionContext,
				);
			});
		},
	};
}
