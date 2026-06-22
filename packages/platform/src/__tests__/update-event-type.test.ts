/**
 * Update EventType — business-rule tests.
 *
 * Reproduces two rules from
 * `crates/fc-platform/src/event_type/operations/update.rs`:
 *   - CANNOT_UPDATE_ARCHIVED — cannot update an archived event type (:100-106)
 *   - NO_CHANGES — reject when the provided fields match current (:129-135)
 *
 * Verifies audit-pass-3 MINOR #19 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createUpdateEventTypeUseCase } from "../application/event-type/update-event-type.js";
import type { EventTypeRepository } from "../infrastructure/persistence/index.js";
import type { EventType } from "../domain/index.js";

function makeEventType(overrides: Partial<EventType> = {}): EventType {
	return {
		id: "evt_1",
		name: "Order Placed",
		description: "An order was placed",
		status: "CURRENT",
		...overrides,
	} as unknown as EventType;
}

function makeRepo(eventType: EventType | null): EventTypeRepository {
	return {
		findById: vi.fn(async () => eventType ?? undefined),
	} as unknown as EventTypeRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {
		commit: vi.fn(async (_agg, event) =>
			Result.success(RESULT_SUCCESS_TOKEN, event),
		),
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

describe("update-event-type", () => {
	it("refuses to update an archived event type", async () => {
		const uow = makeUnitOfWork();
		const result = await createUpdateEventTypeUseCase({
			eventTypeRepository: makeRepo(makeEventType({ status: "ARCHIVED" })),
			unitOfWork: uow,
		}).execute({ eventTypeId: "evt_1", name: "New name" }, makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CANNOT_UPDATE_ARCHIVED");
		}
		expect(uow.commit).not.toHaveBeenCalled();
	});

	it("returns NO_CHANGES when the provided fields match the current values", async () => {
		const uow = makeUnitOfWork();
		const result = await createUpdateEventTypeUseCase({
			eventTypeRepository: makeRepo(makeEventType()),
			unitOfWork: uow,
		}).execute(
			{
				eventTypeId: "evt_1",
				name: "Order Placed",
				description: "An order was placed",
			},
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("NO_CHANGES");
		}
		expect(uow.commit).not.toHaveBeenCalled();
	});

	it("commits when a field actually changes", async () => {
		const uow = makeUnitOfWork();
		const result = await createUpdateEventTypeUseCase({
			eventTypeRepository: makeRepo(makeEventType()),
			unitOfWork: uow,
		}).execute({ eventTypeId: "evt_1", name: "Order Confirmed" }, makeContext());

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commit).toHaveBeenCalledOnce();
	});
});
