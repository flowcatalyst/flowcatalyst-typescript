/**
 * Create Application — command + use case in one file.
 *
 * Mirrors the Go port's per-operation file pattern
 * (flowcatalyst-go/internal/platform/application/operations/create.go).
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	Result,
	UseCaseError,
	validateRequired,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import {
	ApplicationCreated,
	ApplicationTypeEnum,
	createApplication,
	type ApplicationType,
} from "../../domain/index.js";
import type { ApplicationRepository } from "../../infrastructure/persistence/index.js";

export interface CreateApplicationCommand extends Command {
	readonly code: string;
	readonly name: string;
	readonly type?: ApplicationType;
	readonly description?: string | null;
	readonly iconUrl?: string | null;
	readonly website?: string | null;
	readonly logo?: string | null;
	readonly logoMimeType?: string | null;
	readonly defaultBaseUrl?: string | null;
}

export interface CreateApplicationUseCaseDeps {
	readonly applicationRepository: ApplicationRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createCreateApplicationUseCase(
	deps: CreateApplicationUseCaseDeps,
): UseCase<CreateApplicationCommand, ApplicationCreated> {
	const { applicationRepository, unitOfWork } = deps;

	return {
		async execute(
			command: CreateApplicationCommand,
			context: ExecutionContext,
		): Promise<Result<ApplicationCreated>> {
			const codeResult = validateRequired(
				command.code,
				"code",
				"CODE_REQUIRED",
			);
			if (Result.isFailure(codeResult)) {
				return codeResult;
			}

			// Code format: lowercase alphanumeric with hyphens or underscores,
			// 1-50 chars, must start and end with alphanumeric.
			const codePattern = /^[a-z0-9][a-z0-9_-]{0,48}[a-z0-9]$|^[a-z0-9]$/;
			if (!codePattern.test(command.code.toLowerCase())) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_CODE",
						"Code must be lowercase alphanumeric with hyphens or underscores, 1-50 characters",
					),
				);
			}

			const nameResult = validateRequired(
				command.name,
				"name",
				"NAME_REQUIRED",
			);
			if (Result.isFailure(nameResult)) {
				return nameResult;
			}

			const codeExists = await applicationRepository.existsByCode(command.code);
			if (codeExists) {
				return Result.failure(
					UseCaseError.businessRule(
						"CODE_EXISTS",
						"Application code already exists",
						{ code: command.code },
					),
				);
			}

			const application = createApplication({
				code: command.code,
				name: command.name,
				type: command.type ?? ApplicationTypeEnum.APPLICATION,
				description: command.description ?? null,
				iconUrl: command.iconUrl ?? null,
				website: command.website ?? null,
				logo: command.logo ?? null,
				logoMimeType: command.logoMimeType ?? null,
				defaultBaseUrl: command.defaultBaseUrl ?? null,
			});

			const event = new ApplicationCreated(context, {
				applicationId: application.id,
				type: application.type,
				code: application.code,
				name: application.name,
			});

			return unitOfWork.commit(application, event, command);
		},
	};
}
