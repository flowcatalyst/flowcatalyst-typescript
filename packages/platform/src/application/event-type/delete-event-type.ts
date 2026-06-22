/**
 * Delete EventType
 *
 * Command + use case in one file.
 *
 * Can delete if:
 * - ARCHIVED status, OR
 * - CURRENT with all schemas in FINALISING status (never finalized)
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { EventTypeRepository } from "../../infrastructure/persistence/index.js";
import {
	allVersionsFinalising,
	EventTypeDeleted,
} from "../../domain/index.js";

export interface DeleteEventTypeCommand extends Command {
	readonly eventTypeId: string;
}

export interface DeleteEventTypeUseCaseDeps {
	readonly eventTypeRepository: EventTypeRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeleteEventTypeUseCase(
	deps: DeleteEventTypeUseCaseDeps,
): UseCase<DeleteEventTypeCommand, EventTypeDeleted> {
	const { eventTypeRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteEventTypeCommand,
			context: ExecutionContext,
		): Promise<Result<EventTypeDeleted>> {
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

			// Can delete if archived
			const isArchived = eventType.status === "ARCHIVED";
			// Can delete if current but all schemas are still FINALISING (never finalized)
			const isNeverFinalized =
				eventType.status === "CURRENT" && allVersionsFinalising(eventType);

			if (!isArchived && !isNeverFinalized) {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_DELETE",
						"Event type can only be deleted when archived or when all schemas are in FINALISING status",
					),
				);
			}

			const event = new EventTypeDeleted(context, {
				eventTypeId: eventType.id,
				code: eventType.code,
			});

			return unitOfWork.commitDelete(eventType, event, command);
		},
	};
}
