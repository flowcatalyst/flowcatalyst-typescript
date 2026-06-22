/**
 * Delete Role — command + use case in one file.
 *
 * Deletes an existing role.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { RoleRepository } from "../../infrastructure/persistence/index.js";
import { RoleDeleted, RoleSource } from "../../domain/index.js";

/**
 * Command to delete a role.
 */
export interface DeleteRoleCommand extends Command {
	readonly roleId: string;
}

/**
 * Dependencies for DeleteRoleUseCase.
 */
export interface DeleteRoleUseCaseDeps {
	readonly roleRepository: RoleRepository;
	readonly unitOfWork: UnitOfWork;
}

/**
 * Create the DeleteRoleUseCase.
 */
export function createDeleteRoleUseCase(
	deps: DeleteRoleUseCaseDeps,
): UseCase<DeleteRoleCommand, RoleDeleted> {
	const { roleRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteRoleCommand,
			context: ExecutionContext,
		): Promise<Result<RoleDeleted>> {
			// Validate role ID
			const roleIdResult = validateRequired(
				command.roleId,
				"roleId",
				"ROLE_ID_REQUIRED",
			);
			if (Result.isFailure(roleIdResult)) {
				return roleIdResult;
			}

			// Find existing role
			const existingRole = await roleRepository.findById(command.roleId);
			if (!existingRole) {
				return Result.failure(
					UseCaseError.notFound("ROLE_NOT_FOUND", "Role not found", {
						roleId: command.roleId,
					}),
				);
			}

			// Only DATABASE-defined roles can be deleted. CODE roles are
			// owned by the platform's own permission seed; SDK roles are
			// owned by an external application and would re-sync after
			// deletion. Matches Rust crates/fc-platform/src/role/operations/delete.rs:80-86.
			if (existingRole.source !== RoleSource.DATABASE) {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_DELETE_ROLE",
						"Cannot delete a code-defined or SDK-synced role",
						{
							roleId: command.roleId,
							roleName: existingRole.name,
							source: existingRole.source,
						},
					),
				);
			}

			// Refuse deletion while principals still hold this role.
			// iam_principal_roles has no DB-level FK on role_name (integrity
			// is enforced in code), so dropping the role here would orphan
			// the assignments. Force the admin to strip them first.
			// Matches Rust delete.rs:88-110.
			const assignments = await roleRepository.countAssignments(
				existingRole.name,
			);
			if (assignments > 0) {
				return Result.failure(
					UseCaseError.businessRule(
						"ROLE_HAS_ASSIGNMENTS",
						`Cannot delete role '${existingRole.name}' — ${assignments} principal(s) still hold it. Strip the assignments before deleting.`,
						{
							roleId: command.roleId,
							roleName: existingRole.name,
							assignments,
						},
					),
				);
			}

			// Create domain event
			const event = new RoleDeleted(context, {
				roleId: existingRole.id,
				name: existingRole.name,
			});

			// Delete and commit atomically
			return unitOfWork.commitDelete(existingRole, event, command);
		},
	};
}
