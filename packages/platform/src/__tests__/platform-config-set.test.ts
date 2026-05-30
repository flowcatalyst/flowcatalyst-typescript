/**
 * Set Platform Config — business-rule test.
 *
 * Reproduces the natural-key validation from
 * `crates/fc-platform/src/platform_config/operations/set_property.rs:51-68`:
 * empty applicationCode / section / property are rejected before the
 * upsert. (Unreachable over HTTP — they're URL path params — but the use
 * case shouldn't rely on that.)
 *
 * Verifies audit-pass-3 MINOR #21 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createSetPlatformConfigUseCase } from "../application/platform-config/set/use-case.js";
import type { SetPlatformConfigCommand } from "../application/platform-config/set/command.js";
import type { PlatformConfigRepository } from "../infrastructure/persistence/index.js";

function makeRepo(): PlatformConfigRepository {
	return {
		findByKey: vi.fn(async () => undefined),
		insert: vi.fn(async () => {}),
		update: vi.fn(async () => {}),
	} as unknown as PlatformConfigRepository;
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

function cmd(
	overrides: Partial<SetPlatformConfigCommand>,
): SetPlatformConfigCommand {
	return {
		applicationCode: "platform",
		section: "limits",
		property: "max_retries",
		scope: "GLOBAL",
		clientId: null,
		value: "3",
		valueType: "NUMBER",
		description: null,
		...overrides,
	} as unknown as SetPlatformConfigCommand;
}

describe("set-platform-config natural-key validation", () => {
	it("rejects an empty applicationCode", async () => {
		const repo = makeRepo();
		const result = await createSetPlatformConfigUseCase({
			platformConfigRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(cmd({ applicationCode: "" }), makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("APPLICATION_CODE_REQUIRED");
		}
		expect(repo.findByKey).not.toHaveBeenCalled();
	});

	it("rejects an empty section", async () => {
		const repo = makeRepo();
		const result = await createSetPlatformConfigUseCase({
			platformConfigRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(cmd({ section: "  " }), makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("SECTION_REQUIRED");
		}
		expect(repo.findByKey).not.toHaveBeenCalled();
	});

	it("rejects an empty property", async () => {
		const repo = makeRepo();
		const result = await createSetPlatformConfigUseCase({
			platformConfigRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(cmd({ property: "" }), makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("PROPERTY_REQUIRED");
		}
		expect(repo.findByKey).not.toHaveBeenCalled();
	});
});
