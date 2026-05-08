/**
 * Reset User Password Use Case
 *
 * Admin-initiated password reset for a USER principal that authenticates
 * internally. Hashes the new password (honouring the complexity policy
 * unless explicitly relaxed), updates the principal, and emits a
 * `PasswordReset` event — all atomically through `unitOfWork.commit`.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { PasswordService } from "@flowcatalyst/platform-crypto";

import type { PrincipalRepository } from "../../../infrastructure/persistence/index.js";
import { PasswordReset } from "../../../domain/index.js";

import type { ResetUserPasswordCommand } from "./command.js";

export interface ResetUserPasswordUseCaseDeps {
	readonly principalRepository: PrincipalRepository;
	readonly passwordService: PasswordService;
	readonly unitOfWork: UnitOfWork;
}

export function createResetUserPasswordUseCase(
	deps: ResetUserPasswordUseCaseDeps,
): UseCase<ResetUserPasswordCommand, PasswordReset> {
	const { principalRepository, passwordService, unitOfWork } = deps;

	return {
		async execute(
			command: ResetUserPasswordCommand,
			context: ExecutionContext,
		): Promise<Result<PasswordReset>> {
			const idResult = validateRequired(
				command.userId,
				"userId",
				"USER_ID_REQUIRED",
			);
			if (Result.isFailure(idResult)) return idResult;

			const passwordResult = validateRequired(
				command.newPassword,
				"newPassword",
				"NEW_PASSWORD_REQUIRED",
			);
			if (Result.isFailure(passwordResult)) return passwordResult;

			const principal = await principalRepository.findById(command.userId);
			if (!principal || principal.type !== "USER") {
				return Result.failure(
					UseCaseError.notFound("USER_NOT_FOUND", "User not found", {
						userId: command.userId,
					}),
				);
			}

			if (
				!principal.userIdentity ||
				principal.userIdentity.idpType !== "INTERNAL"
			) {
				return Result.failure(
					UseCaseError.businessRule(
						"NOT_INTERNAL_AUTH",
						"Password reset is only supported for internal authentication users",
					),
				);
			}

			const enforceComplexity = command.enforcePasswordComplexity ?? true;
			const hashResult = await passwordService.validateAndHash(
				command.newPassword,
				{ enforceComplexity },
			);
			if (hashResult.isErr()) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_PASSWORD",
						"Password does not meet complexity requirements",
					),
				);
			}

			const updated = {
				...principal,
				userIdentity: {
					...principal.userIdentity,
					passwordHash: hashResult.value,
				},
				updatedAt: new Date(),
			};

			const event = new PasswordReset(context, {
				userId: updated.id,
				email: updated.userIdentity.email,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
