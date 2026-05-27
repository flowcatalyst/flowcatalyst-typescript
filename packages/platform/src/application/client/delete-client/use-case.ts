/**
 * Delete Client Use Case
 *
 * Deletes a client from the system.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ClientRepository } from "../../../infrastructure/persistence/index.js";
import { ClientDeleted } from "../../../domain/index.js";

import type { DeleteClientCommand } from "./command.js";

/**
 * Dependencies for DeleteClientUseCase.
 */
export interface DeleteClientUseCaseDeps {
	readonly clientRepository: ClientRepository;
	readonly unitOfWork: UnitOfWork;
}

/**
 * Create the DeleteClientUseCase.
 */
export function createDeleteClientUseCase(
	deps: DeleteClientUseCaseDeps,
): UseCase<DeleteClientCommand, ClientDeleted> {
	const { clientRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteClientCommand,
			context: ExecutionContext,
		): Promise<Result<ClientDeleted>> {
			// Validate client ID
			const clientIdResult = validateRequired(
				command.clientId,
				"clientId",
				"CLIENT_ID_REQUIRED",
			);
			if (Result.isFailure(clientIdResult)) {
				return clientIdResult;
			}

			// Find client
			const client = await clientRepository.findById(command.clientId);
			if (!client) {
				return Result.failure(
					UseCaseError.notFound("CLIENT_NOT_FOUND", "Client not found"),
				);
			}

			// Refuse deletion when principals still have this as their home
			// client. iam_principals.client_id is a code-enforced reference (no
			// DB-level FK). Silently orphaning a user's home client would change
			// their scope without explicit action — force the admin to migrate
			// them first. Matches Rust crates/fc-platform/src/client/operations/delete.rs:77-99.
			const homePrincipals = await clientRepository.countHomePrincipals(client.id);
			if (homePrincipals > 0) {
				return Result.failure(
					UseCaseError.businessRule(
						"CLIENT_HAS_PRINCIPALS",
						`Cannot delete client '${client.identifier}' — ${homePrincipals} principal(s) have it as their home client. Migrate those principals before deleting.`,
						{ clientId: client.id, homePrincipals },
					),
				);
			}

			// Refuse deletion while access grants or application configs still
			// reference this client. Same FK-less story as above.
			// Matches Rust delete.rs:101-136.
			const [grants, configs] = await Promise.all([
				clientRepository.countAccessGrants(client.id),
				clientRepository.countClientConfigs(client.id),
			]);
			const blockers: string[] = [];
			if (grants > 0) blockers.push(`${grants} access grants`);
			if (configs > 0) blockers.push(`${configs} application configs`);
			if (blockers.length > 0) {
				return Result.failure(
					UseCaseError.businessRule(
						"CLIENT_HAS_REFERENCES",
						`Cannot delete client '${client.identifier}' — ${blockers.join(", ")} still reference it. Remove those before deleting.`,
						{ clientId: client.id, blockers },
					),
				);
			}

			// Create domain event
			const event = new ClientDeleted(context, {
				clientId: client.id,
				name: client.name,
				identifier: client.identifier,
			});

			// Delete atomically
			return unitOfWork.commitDelete(client, event, command);
		},
	};
}
