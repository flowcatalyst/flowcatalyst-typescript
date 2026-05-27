/**
 * Create Client Use Case
 *
 * Creates a new client organization in the system.
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
import { createClient, ClientCreated } from "../../../domain/index.js";

import type { CreateClientCommand } from "./command.js";

/**
 * Dependencies for CreateClientUseCase.
 */
export interface CreateClientUseCaseDeps {
	readonly clientRepository: ClientRepository;
	readonly unitOfWork: UnitOfWork;
}

/**
 * Create the CreateClientUseCase.
 */
export function createCreateClientUseCase(
	deps: CreateClientUseCaseDeps,
): UseCase<CreateClientCommand, ClientCreated> {
	const { clientRepository, unitOfWork } = deps;

	return {
		async execute(
			command: CreateClientCommand,
			context: ExecutionContext,
		): Promise<Result<ClientCreated>> {
			// Validate name
			const nameResult = validateRequired(
				command.name,
				"name",
				"NAME_REQUIRED",
			);
			if (Result.isFailure(nameResult)) {
				return nameResult;
			}

			// Validate identifier
			const identifierResult = validateRequired(
				command.identifier,
				"identifier",
				"IDENTIFIER_REQUIRED",
			);
			if (Result.isFailure(identifierResult)) {
				return identifierResult;
			}

			// Validate identifier format. Mirrors Rust
			// crates/fc-platform/src/client/operations/create.rs:13-17,72-86:
			// must start with a letter, end with alphanumeric, only lowercase
			// alphanumeric + hyphens in between, length 2-50.
			// (Earlier TS regex allowed underscores, leading digits, and
			// 1-60 chars — those forms are now rejected.)
			const identifier = command.identifier.toLowerCase();
			if (identifier.length < 2 || identifier.length > 50) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_IDENTIFIER",
						"Client identifier must be between 2 and 50 characters",
					),
				);
			}
			const identifierPattern = /^[a-z][a-z0-9-]*[a-z0-9]$/;
			if (!identifierPattern.test(identifier)) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_IDENTIFIER",
						"Client identifier must be lowercase alphanumeric with hyphens, starting with a letter",
					),
				);
			}

			// Check if identifier already exists
			const identifierExists = await clientRepository.existsByIdentifier(
				command.identifier,
			);
			if (identifierExists) {
				return Result.failure(
					UseCaseError.businessRule(
						"IDENTIFIER_EXISTS",
						"Client identifier already exists",
						{
							identifier: command.identifier,
						},
					),
				);
			}

			// Create client
			const client = createClient({
				name: command.name,
				identifier: command.identifier,
			});

			// Create domain event
			const event = new ClientCreated(context, {
				clientId: client.id,
				name: client.name,
				identifier: client.identifier,
			});

			// Commit atomically
			return unitOfWork.commit(client, event, command);
		},
	};
}
