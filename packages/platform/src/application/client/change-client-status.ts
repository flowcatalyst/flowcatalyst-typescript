/**
 * Change Client Status
 *
 * Command + use case in one file.
 */

import type { UseCase, Command } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ClientRepository } from "../../infrastructure/persistence/index.js";
import {
	changeClientStatus,
	ClientStatus,
	ClientStatusChanged,
} from "../../domain/index.js";

/**
 * Command to change a client's status.
 */
export interface ChangeClientStatusCommand extends Command {
	readonly clientId: string;
	readonly newStatus: ClientStatus;
	readonly reason: string | null;
	readonly note: string | null;
}

/**
 * Dependencies for ChangeClientStatusUseCase.
 */
export interface ChangeClientStatusUseCaseDeps {
	readonly clientRepository: ClientRepository;
	readonly unitOfWork: UnitOfWork;
}

/**
 * Create the ChangeClientStatusUseCase.
 */
export function createChangeClientStatusUseCase(
	deps: ChangeClientStatusUseCaseDeps,
): UseCase<ChangeClientStatusCommand, ClientStatusChanged> {
	const { clientRepository, unitOfWork } = deps;

	return {
		async execute(
			command: ChangeClientStatusCommand,
			context: ExecutionContext,
		): Promise<Result<ClientStatusChanged>> {
			// Validate client ID
			const clientIdResult = validateRequired(
				command.clientId,
				"clientId",
				"CLIENT_ID_REQUIRED",
			);
			if (Result.isFailure(clientIdResult)) {
				return clientIdResult;
			}

			// Validate new status
			const statusResult = validateRequired(
				command.newStatus,
				"newStatus",
				"STATUS_REQUIRED",
			);
			if (Result.isFailure(statusResult)) {
				return statusResult;
			}

			// Suspension-specific validation. The generic status op accepts an
			// arbitrary target, but a suspend must carry a non-empty reason of
			// at most 500 chars. Matches Rust client/operations/suspend.rs:51-63.
			if (command.newStatus === ClientStatus.SUSPENDED) {
				const reason = command.reason?.trim() ?? "";
				if (reason === "") {
					return Result.failure(
						UseCaseError.validation(
							"REASON_REQUIRED",
							"Suspension reason is required",
						),
					);
				}
				if (reason.length > 500) {
					return Result.failure(
						UseCaseError.validation(
							"REASON_TOO_LONG",
							"Suspension reason must be at most 500 characters",
						),
					);
				}
			}

			// Find client
			const client = await clientRepository.findById(command.clientId);
			if (!client) {
				return Result.failure(
					UseCaseError.notFound("CLIENT_NOT_FOUND", "Client not found"),
				);
			}

			// Business rule: cannot suspend an inactive client. Matches Rust
			// client/operations/suspend.rs:101-107.
			if (
				command.newStatus === ClientStatus.SUSPENDED &&
				client.status === ClientStatus.INACTIVE
			) {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_SUSPEND_INACTIVE",
						"Cannot suspend an inactive client",
						{ currentStatus: client.status },
					),
				);
			}

			// Check if status is the same
			if (client.status === command.newStatus) {
				return Result.failure(
					UseCaseError.businessRule(
						"STATUS_UNCHANGED",
						"Client already has the specified status",
						{
							currentStatus: client.status,
						},
					),
				);
			}

			// Get principal ID for the changedBy field
			const changedBy = context.principalId ?? "SYSTEM";

			// Change status
			const previousStatus = client.status;
			const updatedClient = changeClientStatus(
				client,
				command.newStatus,
				command.reason,
				command.note,
				changedBy,
			);

			// Create domain event
			const event = new ClientStatusChanged(context, {
				clientId: updatedClient.id,
				name: updatedClient.name,
				previousStatus,
				newStatus: command.newStatus,
				reason: command.reason,
			});

			// Commit atomically
			return unitOfWork.commit(updatedClient, event, command);
		},
	};
}
