/**
 * Update EventType
 *
 * Command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { EventTypeRepository } from "../../infrastructure/persistence/index.js";
import { updateEventType, EventTypeUpdated } from "../../domain/index.js";

export interface UpdateEventTypeCommand extends Command {
	readonly eventTypeId: string;
	readonly name?: string | undefined;
	readonly description?: string | null | undefined;
}

export interface UpdateEventTypeUseCaseDeps {
	readonly eventTypeRepository: EventTypeRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdateEventTypeUseCase(
	deps: UpdateEventTypeUseCaseDeps,
): UseCase<UpdateEventTypeCommand, EventTypeUpdated> {
	const { eventTypeRepository, unitOfWork } = deps;

	return {
		async execute(
			command: UpdateEventTypeCommand,
			context: ExecutionContext,
		): Promise<Result<EventTypeUpdated>> {
			const eventType = await eventTypeRepository.findById(command.eventTypeId);
			if (!eventType) {
				return Result.failure(
					UseCaseError.notFound(
						"EVENT_TYPE_NOT_FOUND",
						"Event type not found",
						{
							eventTypeId: command.eventTypeId,
						},
					),
				);
			}

			// Business rule: cannot update an archived event type. Matches
			// Rust event_type/operations/update.rs:100-106.
			if (eventType.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_UPDATE_ARCHIVED",
						"Cannot update an archived event type",
					),
				);
			}

			// Must have at least one field to update
			if (command.name === undefined && command.description === undefined) {
				return Result.failure(
					UseCaseError.validation(
						"NO_FIELDS",
						"At least one field must be provided",
					),
				);
			}

			if (command.name !== undefined && command.name.length > 100) {
				return Result.failure(
					UseCaseError.validation(
						"NAME_TOO_LONG",
						"Name must be 100 characters or less",
					),
				);
			}

			if (
				command.description !== undefined &&
				command.description !== null &&
				command.description.length > 255
			) {
				return Result.failure(
					UseCaseError.validation(
						"DESCRIPTION_TOO_LONG",
						"Description must be 255 characters or less",
					),
				);
			}

			// No-op guard: reject when the provided fields match the current
			// values rather than emitting an EventTypeUpdated event for nothing.
			// Matches Rust update.rs:129-135.
			const nameChanged =
				command.name !== undefined && command.name !== eventType.name;
			const descriptionChanged =
				command.description !== undefined &&
				command.description !== eventType.description;
			if (!nameChanged && !descriptionChanged) {
				return Result.failure(
					UseCaseError.validation("NO_CHANGES", "No changes detected"),
				);
			}

			const updated = updateEventType(eventType, {
				...(command.name !== undefined ? { name: command.name } : {}),
				...(command.description !== undefined
					? { description: command.description }
					: {}),
			});

			const event = new EventTypeUpdated(context, {
				eventTypeId: updated.id,
				name: updated.name,
				description: updated.description,
			});

			return unitOfWork.commit(updated, event, command);
		},
	};
}
