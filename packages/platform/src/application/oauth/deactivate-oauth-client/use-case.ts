/**
 * Deactivate OAuth Client Use Case
 *
 * Sets `active = false` and emits `OAuthClientDeactivated` atomically.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { OAuthClientRepository } from "../../../infrastructure/persistence/index.js";
import { OAuthClientDeactivated } from "../../../domain/index.js";

import type { DeactivateOAuthClientCommand } from "./command.js";

export interface DeactivateOAuthClientUseCaseDeps {
	readonly oauthClientRepository: OAuthClientRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeactivateOAuthClientUseCase(
	deps: DeactivateOAuthClientUseCaseDeps,
): UseCase<DeactivateOAuthClientCommand, OAuthClientDeactivated> {
	const { oauthClientRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeactivateOAuthClientCommand,
			context: ExecutionContext,
		): Promise<Result<OAuthClientDeactivated>> {
			const idResult = validateRequired(
				command.oauthClientId,
				"oauthClientId",
				"OAUTH_CLIENT_ID_REQUIRED",
			);
			if (Result.isFailure(idResult)) return idResult;

			const existing = await oauthClientRepository.findById(
				command.oauthClientId,
			);
			if (!existing) {
				return Result.failure(
					UseCaseError.notFound(
						"OAUTH_CLIENT_NOT_FOUND",
						`OAuth client not found: ${command.oauthClientId}`,
					),
				);
			}

			const updated = { ...existing, active: false, updatedAt: new Date() };

			const event = new OAuthClientDeactivated(context, {
				oauthClientId: updated.id,
				clientId: updated.clientId,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
