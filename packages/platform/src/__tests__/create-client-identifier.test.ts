/**
 * Create Client — identifier format tests.
 *
 * Pins the tightened regex against
 * `crates/fc-platform/src/client/operations/create.rs:13-17,72-86`:
 * `^[a-z][a-z0-9-]*[a-z0-9]$`, length 2-50.
 *
 * Verifies MINOR #9 in BUSINESS_RULE_GAPS.md.
 *
 * Note: this fix narrows what TS accepts. If any production client has
 * an identifier with `_`, a leading digit, or a trailing hyphen, that
 * row will not be re-creatable through the API after this fix. The
 * audit doc flagged this as needing a prod-data check.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import type { UnitOfWork } from "@flowcatalyst/domain";

import { createCreateClientUseCase } from "../application/client/create-client/use-case.js";
import type { ClientRepository } from "../infrastructure/persistence/repositories/client-repository.js";

function makeRepo(): ClientRepository {
	// Regex check fires before any repo call (except validateRequired).
	// existsByIdentifier is the first repo call after the regex passes;
	// throw a sentinel from it so "regex accepted" is observable.
	return {
		existsByIdentifier: vi.fn(async () => {
			throw new Error("PAST_REGEX");
		}),
	} as unknown as ClientRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {} as unknown as UnitOfWork;
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

function command(identifier: string) {
	return { name: "Acme Corp", identifier };
}

describe("create-client — identifier format (MINOR #9)", () => {
	const valid = [
		"ab", // minimum length
		"acme",
		"acme-corp",
		"a-1",
		"a".repeat(50), // maximum length
	];
	for (const id of valid) {
		it(`accepts "${id}"`, async () => {
			const useCase = createCreateClientUseCase({
				clientRepository: makeRepo(),
				unitOfWork: makeUnitOfWork(),
			});
			// Regex passes -> existsByIdentifier throws PAST_REGEX (sentinel).
			await expect(
				useCase.execute(command(id), makeContext()),
			).rejects.toThrow("PAST_REGEX");
		});
	}

	const cases: Array<{ id: string; reason: string; code: string }> = [
		{ id: "a", reason: "too short (min 2)", code: "INVALID_IDENTIFIER" },
		{ id: "a".repeat(51), reason: "too long (max 50)", code: "INVALID_IDENTIFIER" },
		{ id: "1acme", reason: "leading digit", code: "INVALID_IDENTIFIER" },
		{ id: "acme_corp", reason: "contains underscore", code: "INVALID_IDENTIFIER" },
		{ id: "Acme", reason: "uppercase letter (after lowercase, OK)", code: "" }, // expected to pass after lowercasing
		{ id: "acme-", reason: "trailing hyphen", code: "INVALID_IDENTIFIER" },
		{ id: "-acme", reason: "leading hyphen", code: "INVALID_IDENTIFIER" },
		{ id: "ac me", reason: "contains space", code: "INVALID_IDENTIFIER" },
	];
	for (const { id, reason, code } of cases) {
		if (code === "") {
			it(`accepts "${id}" (${reason}) after lowercasing`, async () => {
				const useCase = createCreateClientUseCase({
					clientRepository: makeRepo(),
					unitOfWork: makeUnitOfWork(),
				});
				await expect(
					useCase.execute(command(id), makeContext()),
				).rejects.toThrow("PAST_REGEX");
			});
		} else {
			it(`rejects "${id}" (${reason})`, async () => {
				const useCase = createCreateClientUseCase({
					clientRepository: makeRepo(),
					unitOfWork: makeUnitOfWork(),
				});
				const result = await useCase.execute(command(id), makeContext());
				expect(Result.isFailure(result)).toBe(true);
				if (Result.isFailure(result)) {
					expect(result.error.code).toBe(code);
				}
			});
		}
	}

	it("still rejects an empty identifier with IDENTIFIER_REQUIRED", async () => {
		const useCase = createCreateClientUseCase({
			clientRepository: makeRepo(),
			unitOfWork: makeUnitOfWork(),
		});
		const result = await useCase.execute(command(""), makeContext());
		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("IDENTIFIER_REQUIRED");
		}
	});
});
