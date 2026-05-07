/**
 * Activate OAuth Client Use Case
 *
 * Sets `active = true` and emits `OAuthClientActivated` atomically.
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
import { OAuthClientActivated } from "../../../domain/index.js";

import type { ActivateOAuthClientCommand } from "./command.js";

export interface ActivateOAuthClientUseCaseDeps {
	readonly oauthClientRepository: OAuthClientRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createActivateOAuthClientUseCase(
	deps: ActivateOAuthClientUseCaseDeps,
): UseCase<ActivateOAuthClientCommand, OAuthClientActivated> {
	const { oauthClientRepository, unitOfWork } = deps;

	return {
		async execute(
			command: ActivateOAuthClientCommand,
			context: ExecutionContext,
		): Promise<Result<OAuthClientActivated>> {
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

			const updated = { ...existing, active: true, updatedAt: new Date() };

			const event = new OAuthClientActivated(context, {
				oauthClientId: updated.id,
				clientId: updated.clientId,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
