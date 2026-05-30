/**
 * Set Platform Config Use Case.
 *
 * Upsert by key — creates a new row if (applicationCode, section, property,
 * scope, clientId) doesn't exist, otherwise updates the existing row's
 * value/valueType/description.
 *
 * Emits PlatformConfigSet with `wasCreated` so the route can return
 * 201 Created vs 200 OK appropriately.
 *
 * Race-handling: the existence check happens outside the transaction so
 * the event can be constructed with known data. The DB unique constraint
 * on (applicationCode, section, property, scope, client_id) rejects the
 * tiny-window double-insert if two writers race; that surfaces as a
 * standard repo error and the route returns 409 / 500. In admin-UI
 * traffic this is not a real concern.
 */

import type { UseCase } from "@flowcatalyst/application";
import {
	Result,
	validateRequired,
	type ExecutionContext,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { TransactionContext } from "@flowcatalyst/persistence";

import type { PlatformConfigRepository } from "../../../infrastructure/persistence/index.js";
import {
	PlatformConfigSet,
	createPlatformConfig,
} from "../../../domain/index.js";

import type { SetPlatformConfigCommand } from "./command.js";

export interface SetPlatformConfigUseCaseDeps {
	readonly platformConfigRepository: PlatformConfigRepository;
	readonly unitOfWork: UnitOfWork;
}

export function createSetPlatformConfigUseCase(
	deps: SetPlatformConfigUseCaseDeps,
): UseCase<SetPlatformConfigCommand, PlatformConfigSet> {
	const { platformConfigRepository, unitOfWork } = deps;

	return {
		async execute(
			command: SetPlatformConfigCommand,
			context: ExecutionContext,
		): Promise<Result<PlatformConfigSet>> {
			// Pre-flight existence check. Lets us construct the event with
			// the resolved id + wasCreated before the UoW. See module docstring
			// on the race window — it's bounded by the DB unique key.
			// Validate the natural-key parts. Over HTTP these arrive as URL
			// path params so they can't be empty, but the use case shouldn't
			// rely on that. Matches Rust platform_config/operations/
			// set_property.rs:51-68.
			for (const [value, field, code] of [
				[
					command.applicationCode,
					"applicationCode",
					"APPLICATION_CODE_REQUIRED",
				],
				[command.section, "section", "SECTION_REQUIRED"],
				[command.property, "property", "PROPERTY_REQUIRED"],
			] as const) {
				const check = validateRequired(value, field, code);
				if (Result.isFailure(check)) return check;
			}

			const existing = await platformConfigRepository.findByKey(
				command.applicationCode,
				command.section,
				command.property,
				command.scope,
				command.clientId,
			);

			const wasCreated = existing === undefined;
			const entity = existing
				? {
						...existing,
						value: command.value,
						valueType: command.valueType,
						description: command.description ?? existing.description,
					}
				: createPlatformConfig({
						applicationCode: command.applicationCode,
						section: command.section,
						property: command.property,
						scope: command.scope,
						clientId: command.clientId,
						valueType: command.valueType,
						value: command.value,
						description: command.description,
					});

			const event = new PlatformConfigSet(context, {
				configId: entity.id,
				applicationCode: command.applicationCode,
				section: command.section,
				property: command.property,
				scope: command.scope,
				clientId: command.clientId,
				valueType: command.valueType,
				wasCreated,
			});

			return unitOfWork.commitOperations(event, command, async (tx) => {
				const txCtx = tx as TransactionContext;
				if (existing) {
					await platformConfigRepository.update(
						entity as typeof existing,
						txCtx,
					);
				} else {
					await platformConfigRepository.insert(entity, txCtx);
				}
			});
		},
	};
}
