/**
 * Create Process — command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	UseCaseError,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";

import type { ProcessRepository } from "../../infrastructure/persistence/index.js";
import {
	parseProcessCode,
	createProcess,
	ProcessCreated,
} from "../../domain/index.js";

export interface CreateProcessCommand extends Command {
	readonly code: string;
	readonly name: string;
	readonly description?: string | null;
	readonly body?: string;
	readonly diagramType?: string | null;
	readonly tags?: string[];
}

export interface CreateProcessUseCaseDeps {
	readonly processRepository: ProcessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createCreateProcessUseCase(
	deps: CreateProcessUseCaseDeps,
): UseCase<CreateProcessCommand, ProcessCreated> {
	const { processRepository, unitOfWork } = deps;

	return {
		async execute(
			command: CreateProcessCommand,
			context: ExecutionContext,
		): Promise<Result<ProcessCreated>> {
			const codeReq = validateRequired(command.code, "code", "CODE_REQUIRED");
			if (Result.isFailure(codeReq)) return codeReq;

			const nameReq = validateRequired(command.name, "name", "NAME_REQUIRED");
			if (Result.isFailure(nameReq)) return nameReq;

			const parsed = parseProcessCode(command.code);
			if (!parsed) {
				return Result.failure(
					UseCaseError.validation(
						"INVALID_CODE_FORMAT",
						"Process code must follow format: application:subdomain:process-name",
					),
				);
			}

			const exists = await processRepository.existsByCode(command.code);
			if (exists) {
				return Result.failure(
					UseCaseError.businessRule(
						"CODE_EXISTS",
						`Process with code '${command.code}' already exists`,
						{ code: command.code },
					),
				);
			}

			const process = createProcess({
				application: parsed.application,
				subdomain: parsed.subdomain,
				processName: parsed.processName,
				name: command.name,
				description: command.description ?? null,
				body: command.body ?? "",
				diagramType:
					command.diagramType && command.diagramType.trim() !== ""
						? command.diagramType
						: "mermaid",
				tags: command.tags ?? [],
			});

			const event = new ProcessCreated(context, {
				processId: process.id,
				code: process.code,
				name: process.name,
				description: process.description,
				application: process.application,
				subdomain: process.subdomain,
				processName: process.processName,
			});

			return unitOfWork.commit(process, event, command);
		},
	};
}
