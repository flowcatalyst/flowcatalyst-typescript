/**
 * Update Process — command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	Result,
	UseCaseError,
	validateRequired,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ProcessRepository } from "../../infrastructure/persistence/index.js";
import { ProcessUpdated, type Process } from "../../domain/index.js";

export interface UpdateProcessCommand extends Command {
	readonly processId: string;
	readonly name?: string;
	readonly description?: string | null;
	readonly body?: string;
	readonly diagramType?: string;
	readonly tags?: string[];
}

export interface UpdateProcessUseCaseDeps {
	readonly processRepository: ProcessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createUpdateProcessUseCase(
	deps: UpdateProcessUseCaseDeps,
): UseCase<UpdateProcessCommand, ProcessUpdated> {
	const { processRepository, unitOfWork } = deps;

	return {
		async execute(
			command: UpdateProcessCommand,
			context: ExecutionContext,
		): Promise<Result<ProcessUpdated>> {
			// Validate process id up front so an empty id returns
			// PROCESS_ID_REQUIRED rather than falling through to
			// PROCESS_NOT_FOUND. Matches Rust process/operations/update.rs:48-53.
			const idResult = validateRequired(
				command.processId,
				"processId",
				"PROCESS_ID_REQUIRED",
			);
			if (Result.isFailure(idResult)) {
				return idResult;
			}

			if (
				command.name === undefined &&
				command.description === undefined &&
				command.body === undefined &&
				command.diagramType === undefined &&
				command.tags === undefined
			) {
				return Result.failure(
					UseCaseError.validation(
						"NO_UPDATES",
						"At least one field must be provided for update",
					),
				);
			}

			const existing = await processRepository.findById(command.processId);
			if (!existing) {
				return Result.failure(
					UseCaseError.notFound(
						"PROCESS_NOT_FOUND",
						`Process with ID '${command.processId}' not found`,
						{ processId: command.processId },
					),
				);
			}

			if (existing.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"CANNOT_UPDATE_ARCHIVED",
						"Cannot update an archived process",
					),
				);
			}

			let next: Process = existing;
			let changedName: string | null = null;
			let changedDescription: string | null = null;
			let bodyChanged = false;
			let changedTags: string[] | null = null;
			let anyChange = false;

			if (command.name !== undefined) {
				const trimmed = command.name.trim();
				if (trimmed !== existing.name) {
					next = { ...next, name: trimmed };
					changedName = trimmed;
					anyChange = true;
				}
			}
			if (command.description !== undefined) {
				if (existing.description !== command.description) {
					next = { ...next, description: command.description };
					changedDescription = command.description;
					anyChange = true;
				}
			}
			if (command.body !== undefined) {
				if (existing.body !== command.body) {
					next = { ...next, body: command.body };
					bodyChanged = true;
					anyChange = true;
				}
			}
			if (command.diagramType !== undefined) {
				const trimmed = command.diagramType.trim();
				if (trimmed !== "" && trimmed !== existing.diagramType) {
					next = { ...next, diagramType: trimmed };
					anyChange = true;
				}
			}
			if (command.tags !== undefined) {
				if (!arrayEquals(existing.tags, command.tags)) {
					next = { ...next, tags: command.tags };
					changedTags = command.tags;
					anyChange = true;
				}
			}

			if (!anyChange) {
				return Result.failure(
					UseCaseError.validation("NO_CHANGES", "No changes detected"),
				);
			}

			next = { ...next, updatedAt: new Date() };

			const event = new ProcessUpdated(context, {
				processId: next.id,
				name: changedName,
				description: changedDescription,
				bodyChanged,
				tags: changedTags,
			});

			return unitOfWork.commit(next, event, command);
		},
	};
}

function arrayEquals(a: readonly string[], b: readonly string[]): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
