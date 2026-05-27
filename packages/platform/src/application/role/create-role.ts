/**
 * Create Role — command + use case in one file.
 *
 * Mirrors the Go port's per-operation file pattern
 * (flowcatalyst-go/internal/platform/role/operations/create.go).
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
	RoleCreated,
	RoleSource,
	createAuthRole,
} from "../../domain/index.js";
import type { RoleRepository } from "../../infrastructure/persistence/index.js";

export interface CreateRoleCommand extends Command {
	/** The application this role belongs to (optional) */
	readonly applicationId?: string | null;
	/** The application code (optional) */
	readonly applicationCode?: string | null;
	/** Short role name (will be prefixed with applicationCode if provided) */
	readonly shortName: string;
	/** Human-readable display name */
	readonly displayName: string;
	readonly description?: string | null;
	readonly permissions?: readonly string[];
	/** Source of this role definition (defaults to DATABASE) */
	readonly source?: RoleSource;
	/** If true, this role syncs to IDPs configured for client-managed roles */
	readonly clientManaged?: boolean;
}

export interface CreateRoleUseCaseDeps {
	readonly roleRepository: RoleRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createCreateRoleUseCase(
	deps: CreateRoleUseCaseDeps,
): UseCase<CreateRoleCommand, RoleCreated> {
	const { roleRepository, unitOfWork } = deps;

	return {
		async execute(
			command: CreateRoleCommand,
			context: ExecutionContext,
		): Promise<Result<RoleCreated>> {
			const shortNameResult = validateRequired(
				command.shortName,
				"shortName",
				"SHORT_NAME_REQUIRED",
			);
			if (Result.isFailure(shortNameResult)) {
				return shortNameResult;
			}

			// shortName format: lowercase alphanumeric with hyphens, 1-100 chars,
			// must start with a letter and end with alphanumeric.
			const namePattern = /^[a-z][a-z0-9-]{0,98}[a-z0-9]$|^[a-z]$/;
			if (!namePattern.test(command.shortName.toLowerCase())) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_SHORT_NAME",
						"Short name must be lowercase alphanumeric with hyphens, 1-100 characters",
					),
				);
			}

			const displayNameResult = validateRequired(
				command.displayName,
				"displayName",
				"DISPLAY_NAME_REQUIRED",
			);
			if (Result.isFailure(displayNameResult)) {
				return displayNameResult;
			}

			// Full name includes the application-code prefix iff the role is
			// scoped to one — global roles use the bare shortName.
			const fullName = command.applicationCode
				? `${command.applicationCode}:${command.shortName.toLowerCase()}`
				: command.shortName.toLowerCase();

			const nameExists = await roleRepository.existsByName(fullName);
			if (nameExists) {
				return Result.failure(
					UseCaseError.businessRule(
						"ROLE_NAME_EXISTS",
						"Role name already exists",
						{ name: fullName },
					),
				);
			}

			const role = createAuthRole({
				applicationId: command.applicationId ?? null,
				applicationCode: command.applicationCode ?? null,
				shortName: command.shortName,
				displayName: command.displayName,
				description: command.description ?? null,
				permissions: command.permissions ?? [],
				source: command.source ?? RoleSource.DATABASE,
				clientManaged: command.clientManaged ?? false,
			});

			const event = new RoleCreated(context, {
				roleId: role.id,
				name: role.name,
				displayName: role.displayName,
				applicationId: role.applicationId,
				applicationCode: role.applicationCode,
				source: role.source,
				permissions: role.permissions,
			});

			return unitOfWork.commit(role, event, command);
		},
	};
}
