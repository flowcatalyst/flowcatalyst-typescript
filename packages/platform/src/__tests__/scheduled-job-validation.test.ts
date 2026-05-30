/**
 * Scheduled Job create/update — business-rule tests.
 *
 * Reproduces rules from the Rust scheduled_job operations:
 *   - delivery_max_attempts must be 1-20 (create.rs:85-90, update.rs:80-87)
 *   - update returns NO_CHANGES when nothing differs (update.rs:120-187)
 *
 * Verifies audit-pass-3 MINOR #18 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createCreateScheduledJobUseCase } from "../application/scheduled-job/create-scheduled-job/use-case.js";
import { createUpdateScheduledJobUseCase } from "../application/scheduled-job/update-scheduled-job/use-case.js";
import type { ScheduledJobRepository } from "../infrastructure/persistence/index.js";
import type { ScheduledJob } from "../domain/index.js";

function makeJob(): ScheduledJob {
	return {
		id: "sjb_1",
		clientId: null,
		code: "nightly",
		name: "Nightly",
		description: null,
		crons: ["0 0 * * *"],
		timezone: "UTC",
		payload: null,
		concurrent: false,
		tracksCompletion: false,
		timeoutSeconds: null,
		deliveryMaxAttempts: 3,
		targetUrl: null,
		status: "ACTIVE",
		version: 1,
		createdBy: null,
		updatedBy: null,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
	} as unknown as ScheduledJob;
}

function makeCreateRepo(): ScheduledJobRepository {
	return {
		findByCode: vi.fn(async () => undefined),
	} as unknown as ScheduledJobRepository;
}

function makeUpdateRepo(job: ScheduledJob | null): ScheduledJobRepository {
	return {
		findById: vi.fn(async () => job ?? undefined),
	} as unknown as ScheduledJobRepository;
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

describe("create-scheduled-job deliveryMaxAttempts bound", () => {
	for (const bad of [0, 21]) {
		it(`rejects deliveryMaxAttempts = ${bad}`, async () => {
			const repo = makeCreateRepo();
			const result = await createCreateScheduledJobUseCase({
				scheduledJobRepository: repo,
				unitOfWork: makeUnitOfWork(),
			}).execute(
				{
					code: "nightly",
					name: "Nightly",
					crons: ["0 0 * * *"],
					deliveryMaxAttempts: bad,
				},
				makeContext(),
			);

			expect(Result.isFailure(result)).toBe(true);
			if (Result.isFailure(result)) {
				expect(result.error.code).toBe("INVALID_DELIVERY_ATTEMPTS");
			}
			expect(repo.findByCode).not.toHaveBeenCalled();
		});
	}
});

describe("update-scheduled-job", () => {
	it("rejects deliveryMaxAttempts out of range before the lookup", async () => {
		const repo = makeUpdateRepo(makeJob());
		const result = await createUpdateScheduledJobUseCase({
			scheduledJobRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(
			{ scheduledJobId: "sjb_1", deliveryMaxAttempts: 0 },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("INVALID_DELIVERY_ATTEMPTS");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});

	it("returns NO_CHANGES when the patch matches the current job", async () => {
		const uow = makeUnitOfWork();
		const result = await createUpdateScheduledJobUseCase({
			scheduledJobRepository: makeUpdateRepo(makeJob()),
			unitOfWork: uow,
		}).execute(
			{
				scheduledJobId: "sjb_1",
				name: "Nightly",
				concurrent: false,
				deliveryMaxAttempts: 3,
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
		const result = await createUpdateScheduledJobUseCase({
			scheduledJobRepository: makeUpdateRepo(makeJob()),
			unitOfWork: uow,
		}).execute(
			{ scheduledJobId: "sjb_1", name: "New name" },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commit).toHaveBeenCalledOnce();
	});
});
