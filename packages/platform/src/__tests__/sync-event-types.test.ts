/**
 * Sync EventTypes — source-scope tests.
 *
 * Reproduces the source handling from
 * `crates/fc-platform/src/event_type/operations/sync.rs:124,215`: sync
 * updates and removes both Api- and Code-sourced event types; UI-sourced
 * are never touched.
 *
 * Verifies audit-pass-3 MAJOR #14a in BUSINESS_RULE_GAPS.md. (#14b — the
 * per-item inline schema sync — is intentionally NOT ported; see the doc.)
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createSyncEventTypesUseCase } from "../application/event-type/sync-event-types/use-case.js";
import type { EventTypeRepository } from "../infrastructure/persistence/index.js";
import type { EventType, EventTypeSource } from "../domain/index.js";

function et(
	id: string,
	code: string,
	source: EventTypeSource,
): EventType {
	return {
		id,
		code,
		source,
		name: "Name",
		description: null,
		status: "CURRENT",
	} as unknown as EventType;
}

function makeRepo(opts: {
	existing?: EventType | undefined;
	prefix?: EventType[];
	deleteById?: ReturnType<typeof vi.fn>;
	update?: ReturnType<typeof vi.fn>;
}): EventTypeRepository {
	return {
		findByCode: vi.fn(async () => opts.existing),
		findByCodePrefix: vi.fn(async () => opts.prefix ?? []),
		insert: vi.fn(async () => {}),
		update: opts.update ?? vi.fn(async () => {}),
		deleteById: opts.deleteById ?? vi.fn(async () => {}),
	} as unknown as EventTypeRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {
		commitOperations: vi.fn(async (event, _cmd, ops) => {
			await ops(undefined);
			return Result.success(RESULT_SUCCESS_TOKEN, event);
		}),
	} as unknown as UnitOfWork;
}

function makeContext(): ExecutionContext {
	return {
		correlationId: "cor_test",
		principalId: "prn_test",
		causationId: null,
		executionId: "exe_test",
		startTime: new Date(),
		logger: {
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			debug: vi.fn(),
		} as unknown as Logger,
	} as unknown as ExecutionContext;
}

const ITEM = { subdomain: "billing", aggregate: "invoice", event: "issued", name: "Issued" };

describe("sync-event-types source scope", () => {
	it("updates an existing CODE-sourced event type", async () => {
		const update = vi.fn(async () => {});
		const result = await createSyncEventTypesUseCase({
			eventTypeRepository: makeRepo({
				existing: et("et_code", "app:billing.invoice.issued", "CODE"),
				update,
			}),
			unitOfWork: makeUnitOfWork(),
		}).execute(
			{ applicationCode: "app", eventTypes: [ITEM] },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(update).toHaveBeenCalledOnce();
	});

	it("removes an unlisted CODE-sourced event type but leaves UI-sourced", async () => {
		const deleteById = vi.fn(async () => {});
		const result = await createSyncEventTypesUseCase({
			eventTypeRepository: makeRepo({
				existing: undefined, // listed item is created, not matched
				prefix: [
					et("et_code", "app:other.thing.happened", "CODE"),
					et("et_ui", "app:ui.thing.happened", "UI"),
				],
				deleteById,
			}),
			unitOfWork: makeUnitOfWork(),
		}).execute(
			{ applicationCode: "app", eventTypes: [ITEM], removeUnlisted: true },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(deleteById).toHaveBeenCalledWith("et_code", undefined);
		expect(deleteById).not.toHaveBeenCalledWith("et_ui", undefined);
		expect(deleteById).toHaveBeenCalledTimes(1);
	});
});
