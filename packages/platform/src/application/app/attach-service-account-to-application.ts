/**
 * Attach Service Account to Application — command + use case in one file.
 *
 * Sets `application.serviceAccountId` and emits
 * `ApplicationServiceAccountProvisioned`. Mutates the Application aggregate,
 * so it lives on the Application side rather than the ServiceAccount side.
 *
 * Idempotent: if the application is already linked to the same service
 * account, the call still emits an event so the audit trail records the
 * intent (matches Rust attach UC behaviour for re-trigger / retry paths).
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ApplicationRepository } from "../../infrastructure/persistence/index.js";
import { ApplicationServiceAccountProvisioned } from "../../domain/index.js";

export interface AttachServiceAccountToApplicationCommand extends Command {
	readonly applicationId: string;
	readonly serviceAccountId: string;
	readonly serviceAccountCode: string;
}

export interface AttachServiceAccountToApplicationUseCaseDeps {
	readonly applicationRepository: ApplicationRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createAttachServiceAccountToApplicationUseCase(
	deps: AttachServiceAccountToApplicationUseCaseDeps,
): UseCase<
	AttachServiceAccountToApplicationCommand,
	ApplicationServiceAccountProvisioned
> {
	const { applicationRepository, unitOfWork } = deps;

	return {
		async execute(
			command: AttachServiceAccountToApplicationCommand,
			context: ExecutionContext,
		): Promise<Result<ApplicationServiceAccountProvisioned>> {
			const appIdResult = validateRequired(
				command.applicationId,
				"applicationId",
				"APPLICATION_ID_REQUIRED",
			);
			if (Result.isFailure(appIdResult)) return appIdResult;

			const saIdResult = validateRequired(
				command.serviceAccountId,
				"serviceAccountId",
				"SERVICE_ACCOUNT_ID_REQUIRED",
			);
			if (Result.isFailure(saIdResult)) return saIdResult;

			const application = await applicationRepository.findById(
				command.applicationId,
			);
			if (!application) {
				return Result.failure(
					UseCaseError.notFound(
						"APPLICATION_NOT_FOUND",
						`Application not found: ${command.applicationId}`,
					),
				);
			}

			// Reject overwriting a *different* service account; allow the
			// idempotent re-link to the same one.
			if (
				application.serviceAccountId !== null &&
				application.serviceAccountId !== command.serviceAccountId
			) {
				return Result.failure(
					UseCaseError.businessRule(
						"APPLICATION_HAS_SERVICE_ACCOUNT",
						"Application already has a different service account provisioned",
					),
				);
			}

			const updated = {
				...application,
				serviceAccountId: command.serviceAccountId,
				updatedAt: new Date(),
			};

			const event = new ApplicationServiceAccountProvisioned(context, {
				applicationId: updated.id,
				applicationCode: updated.code,
				serviceAccountId: command.serviceAccountId,
				serviceAccountCode: command.serviceAccountCode,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
