/**
 * Sync Processes Use Case
 *
 * Bulk creates/updates/deletes processes from an application SDK. API/CODE
 * sourced processes are eligible for update or removal; UI sourced are
 * preserved.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	Result,
	UseCaseError,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { ProcessRepository } from "../../../infrastructure/persistence/index.js";
import {
	parseProcessCode,
	createProcessFromApi,
	ProcessesSynced,
} from "../../../domain/index.js";

import type { SyncProcessesCommand } from "./command.js";

export interface SyncProcessesUseCaseDeps {
	readonly processRepository: ProcessRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createSyncProcessesUseCase(
	deps: SyncProcessesUseCaseDeps,
): UseCase<SyncProcessesCommand, ProcessesSynced> {
	const { processRepository, unitOfWork } = deps;

	return {
		async execute(
			command: SyncProcessesCommand,
			context: ExecutionContext,
		): Promise<Result<ProcessesSynced>> {
			const appReq = validateRequired(
				command.applicationCode,
				"applicationCode",
				"APPLICATION_CODE_REQUIRED",
			);
			if (Result.isFailure(appReq)) return appReq;

			const eventData = {
				applicationCode: command.applicationCode,
				processesCreated: 0,
				processesUpdated: 0,
				processesDeleted: 0,
				syncedProcessCodes: [] as string[],
			};

			const event = new ProcessesSynced(context, eventData);

			return unitOfWork.commitOperations(event, command, async (tx) => {
				const txCtx = tx as TransactionContext;
				const existing = await processRepository.findByApplication(
					command.applicationCode,
					txCtx,
				);

				let created = 0;
				let updated = 0;
				let deleted = 0;
				const syncedCodes: string[] = [];

				for (const item of command.processes) {
					syncedCodes.push(item.code);

					const parsed = parseProcessCode(item.code);
					if (!parsed) {
						throw UseCaseError.validation(
							"INVALID_PROCESS_CODE",
							`Process code must follow format: application:subdomain:process-name (got '${item.code}')`,
						);
					}

					const match = existing.find((p) => p.code === item.code);
					if (match) {
						if (match.source === "API" || match.source === "CODE") {
							const updatedEntity = {
								...match,
								name: item.name,
								description: item.description ?? null,
								body: item.body ?? "",
								diagramType:
									item.diagramType && item.diagramType.trim() !== ""
										? item.diagramType
										: match.diagramType,
								tags: item.tags ?? [],
								updatedAt: new Date(),
							};
							await processRepository.update(updatedEntity, txCtx);
							updated++;
						}
						// UI-sourced processes are left untouched.
					} else {
						const newProcess = createProcessFromApi({
							application: parsed.application,
							subdomain: parsed.subdomain,
							processName: parsed.processName,
							name: item.name,
							description: item.description ?? null,
							body: item.body ?? "",
							diagramType:
								item.diagramType && item.diagramType.trim() !== ""
									? item.diagramType
									: "mermaid",
							tags: item.tags ?? [],
						});
						await processRepository.insert(newProcess, txCtx);
						created++;
					}
				}

				if (command.removeUnlisted) {
					for (const p of existing) {
						if (
							(p.source === "API" || p.source === "CODE") &&
							!syncedCodes.includes(p.code)
						) {
							await processRepository.deleteById(p.id, txCtx);
							deleted++;
						}
					}
				}

				eventData.processesCreated = created;
				eventData.processesUpdated = updated;
				eventData.processesDeleted = deleted;
				eventData.syncedProcessCodes = syncedCodes;
			});
		},
	};
}
