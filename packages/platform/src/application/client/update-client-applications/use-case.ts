/**
 * Update Client Applications Use Case
 *
 * Bulk-replaces the enabled-application set for a client. Computes the diff
 * against current state and persists every changed `ApplicationClientConfig`
 * row in one transaction with a single `ClientApplicationsUpdated` event —
 * replacing the prior pattern of looping per-app enable/disable use cases
 * which emitted N events per UI action.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type {
	ApplicationRepository,
	ApplicationClientConfigRepository,
	ClientRepository,
} from "../../../infrastructure/persistence/index.js";
import {
	type ApplicationClientConfig,
	createApplicationClientConfig,
	setApplicationClientConfigEnabled,
	ClientApplicationsUpdated,
} from "../../../domain/index.js";

import type { UpdateClientApplicationsCommand } from "./command.js";

export interface UpdateClientApplicationsUseCaseDeps {
	readonly applicationRepository: ApplicationRepository;
	readonly clientRepository: ClientRepository;
	readonly applicationClientConfigRepository: ApplicationClientConfigRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdateClientApplicationsUseCase(
	deps: UpdateClientApplicationsUseCaseDeps,
): UseCase<UpdateClientApplicationsCommand, ClientApplicationsUpdated> {
	const {
		applicationRepository,
		clientRepository,
		applicationClientConfigRepository,
		unitOfWork,
	} = deps;

	return {
		async execute(
			command: UpdateClientApplicationsCommand,
			context: ExecutionContext,
		): Promise<Result<ClientApplicationsUpdated>> {
			const clientIdResult = validateRequired(
				command.clientId,
				"clientId",
				"CLIENT_ID_REQUIRED",
			);
			if (Result.isFailure(clientIdResult)) return clientIdResult;

			// Client must exist.
			const clientExists = await clientRepository.exists(command.clientId);
			if (!clientExists) {
				return Result.failure(
					UseCaseError.notFound("CLIENT_NOT_FOUND", "Client not found", {
						clientId: command.clientId,
					}),
				);
			}

			// Every requested application must exist.
			for (const appId of command.enabledApplicationIds) {
				const exists = await applicationRepository.exists(appId);
				if (!exists) {
					return Result.failure(
						UseCaseError.notFound(
							"APPLICATION_NOT_FOUND",
							"Application not found",
							{ applicationId: appId },
						),
					);
				}
			}

			const currentConfigs =
				await applicationClientConfigRepository.findByClient(command.clientId);

			const desired = new Set(command.enabledApplicationIds);
			const currentlyEnabled = new Set(
				currentConfigs.filter((c) => c.enabled).map((c) => c.applicationId),
			);

			const toPersist: ApplicationClientConfig[] = [];
			const enabledAdded: string[] = [];
			const disabledRemoved: string[] = [];

			// Enable: requested but not currently enabled.
			for (const appId of command.enabledApplicationIds) {
				if (currentlyEnabled.has(appId)) continue;
				const existing = currentConfigs.find((c) => c.applicationId === appId);
				const cfg = existing
					? setApplicationClientConfigEnabled(existing, true)
					: createApplicationClientConfig({
							applicationId: appId,
							clientId: command.clientId,
							enabled: true,
						});
				toPersist.push(cfg as ApplicationClientConfig);
				enabledAdded.push(appId);
			}

			// Disable: currently enabled but not requested.
			for (const cfg of currentConfigs) {
				if (cfg.enabled && !desired.has(cfg.applicationId)) {
					toPersist.push(setApplicationClientConfigEnabled(cfg, false));
					disabledRemoved.push(cfg.applicationId);
				}
			}

			const event = new ClientApplicationsUpdated(context, {
				clientId: command.clientId,
				enabledApplicationIds: [...command.enabledApplicationIds],
				enabledAdded,
				disabledRemoved,
			});

			// No-op: still emit one event so the audit trail records the request.
			if (toPersist.length === 0) {
				return unitOfWork.commitOperations(event, command, async () => {});
			}

			return unitOfWork.commitAll(toPersist, event, command);
		},
	};
}
