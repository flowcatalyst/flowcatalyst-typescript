/**
 * Delete Dispatch Pool
 *
 * Command + use case in one file.
 *
 * Archives a dispatch pool (soft delete via ARCHIVED status).
 *
 * Deliberate divergence from the Rust port, which hard-deletes the row
 * (crates/fc-platform/src/dispatch_pool/operations/delete.rs). Both emit
 * the same `DispatchPoolDeleted` wire event, so cross-port consumers see
 * identical behaviour — only the local DB outcome differs, and no other
 * port reads this DB. The soft-delete model is intentional in TS: the
 * ARCHIVED status is shared with sync-pools (archives pools dropped from
 * config) and update-pool (refuses to mutate archived pools). See
 * BUSINESS_RULE_GAPS.md "MAJOR #5" for the decision record.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import { Result, UseCaseError } from "@flowcatalyst/application";
import type { ExecutionContext, UnitOfWork } from "@flowcatalyst/domain";

import type { DispatchPoolRepository } from "../../infrastructure/persistence/index.js";
import {
	updateDispatchPool,
	DispatchPoolDeleted,
} from "../../domain/index.js";

export interface DeleteDispatchPoolCommand extends Command {
	readonly poolId: string;
}

export interface DeleteDispatchPoolUseCaseDeps {
	readonly dispatchPoolRepository: DispatchPoolRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createDeleteDispatchPoolUseCase(
	deps: DeleteDispatchPoolUseCaseDeps,
): UseCase<DeleteDispatchPoolCommand, DispatchPoolDeleted> {
	const { dispatchPoolRepository, unitOfWork } = deps;

	return {
		async execute(
			command: DeleteDispatchPoolCommand,
			context: ExecutionContext,
		): Promise<Result<DispatchPoolDeleted>> {
			const pool = await dispatchPoolRepository.findById(command.poolId);
			if (!pool) {
				return Result.failure(
					UseCaseError.notFound("POOL_NOT_FOUND", "Dispatch pool not found", {
						poolId: command.poolId,
					}),
				);
			}

			if (pool.status === "ARCHIVED") {
				return Result.failure(
					UseCaseError.businessRule(
						"POOL_ALREADY_ARCHIVED",
						"Dispatch pool is already archived",
					),
				);
			}

			// Soft delete by setting status to ARCHIVED
			const archived = updateDispatchPool(pool, { status: "ARCHIVED" });

			const event = new DispatchPoolDeleted(context, {
				poolId: pool.id,
				code: pool.code,
				clientId: pool.clientId,
			});

			return unitOfWork.commit(archived, event, command);
		},
	};
}
