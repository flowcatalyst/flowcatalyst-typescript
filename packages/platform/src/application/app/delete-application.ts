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

			// Reference-count blockers — refuse deletion while any code-enforced
			// reference still points at this application. None of these columns
			// have DB-level FKs; integrity is enforced here, not by the database.
			// Mirrors Rust crates/fc-platform/src/application/operations/delete.rs:85-143.
			const [grants, configs, sas, roles, principalRefs] = await Promise.all([
				applicationRepository.countAccessGrants(application.id),
				applicationRepository.countClientConfigs(application.id),
				applicationRepository.countServiceAccounts(application.id),
				applicationRepository.countRoles(application.id),
				applicationRepository.countPrincipalRefs(application.id),
			]);

			const blockers: string[] = [];
			if (grants > 0) blockers.push(`${grants} access grants`);
			if (configs > 0) blockers.push(`${configs} client configs`);
			if (sas > 0) blockers.push(`${sas} service accounts`);
			if (roles > 0) blockers.push(`${roles} application roles`);
			if (principalRefs > 0) blockers.push(`${principalRefs} principal refs`);

			if (blockers.length > 0) {
				return Result.failure(
					UseCaseError.businessRule(
						"APPLICATION_HAS_REFERENCES",
						`Cannot delete application '${application.code}' — ${blockers.join(", ")} still reference it. Remove those before deleting.`,
						{ applicationId: application.id, blockers },
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
