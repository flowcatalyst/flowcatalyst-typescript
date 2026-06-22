/**
 * Update Process — business-rule test.
 *
 * Reproduces the up-front id check from
 * `crates/fc-platform/src/process/operations/update.rs:48-53`:
 * an empty/whitespace process id returns PROCESS_ID_REQUIRED rather than
 * falling through to PROCESS_NOT_FOUND.
 *
 * Verifies audit-pass-3 MINOR #20 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createUpdateProcessUseCase } from "../application/process/update-process.js";
import type { ProcessRepository } from "../infrastructure/persistence/index.js";

function makeRepo(): ProcessRepository {
	return {
		findById: vi.fn(async () => undefined),
	} as unknown as ProcessRepository;
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

describe("update-process", () => {
	it("rejects an empty process id with PROCESS_ID_REQUIRED", async () => {
		const repo = makeRepo();
		const result = await createUpdateProcessUseCase({
			processRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute({ processId: "", name: "New name" }, makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("PROCESS_ID_REQUIRED");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});

	it("rejects a whitespace-only process id", async () => {
		const repo = makeRepo();
		const result = await createUpdateProcessUseCase({
			processRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute({ processId: "   ", name: "New name" }, makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("PROCESS_ID_REQUIRED");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});

	it("passes the id guard for a non-empty id (reaches the not-found path)", async () => {
		const repo = makeRepo();
		const result = await createUpdateProcessUseCase({
			processRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute({ processId: "prc_x", name: "New name" }, makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("PROCESS_NOT_FOUND");
		}
		expect(repo.findById).toHaveBeenCalledOnce();
	});
});
