/**
 * Delete User Use Case
 *
 * Deletes an existing user.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { PrincipalRepository } from "../../../infrastructure/persistence/index.js";
import { UserDeleted, PrincipalType } from "../../../domain/index.js";

import type { DeleteUserCommand } from "./command.js";

/**
 * Dependencies for DeleteUserUseCase.
 */
export interface DeleteUserUseCaseDeps {
	readonly principalRepository: PrincipalRepository;
	readonly unitOfWork: UnitOfWork;
}

/**
 * Create the DeleteUserUseCase.
 */
export function createDeleteUserUseCase(
	deps: DeleteUserUseCaseDeps,
): UseCase<DeleteUserCommand, UserDeleted> {
	const { principalRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteUserCommand,
			context: ExecutionContext,
		): Promise<Result<UserDeleted>> {
			// Validate userId
			const userIdResult = validateRequired(
				command.userId,
				"userId",
				"USER_ID_REQUIRED",
			);
			if (Result.isFailure(userIdResult)) {
				return userIdResult;
			}

			// Cannot delete your own account. Matches Rust
			// crates/fc-platform/src/principal/operations/delete.rs:63-69.
			// Guards against an admin locking themselves out and against
			// the audit trail losing the actor mid-operation.
			if (command.userId === context.principalId) {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_DELETE_SELF",
						"Cannot delete your own account",
					),
				);
			}

			// Find the user
			const principal = await principalRepository.findById(command.userId);
			if (!principal) {
				return Result.failure(
					UseCaseError.notFound(
						"USER_NOT_FOUND",
						`User not found: ${command.userId}`,
					),
				);
			}

			// Verify it's a USER type
			if (principal.type !== PrincipalType.USER) {
				return Result.failure(
					UseCaseError.businessRule("NOT_A_USER", "Principal is not a user", {
						type: principal.type,
					}),
				);
			}

			// Create domain event
			const event = new UserDeleted(context, {
				userId: principal.id,
				email: principal.userIdentity?.email ?? "",
			});

			// Delete atomically
			return unitOfWork.commitDelete(principal, event, command);
		},
	};
}
