/**
 * Delete Client — business-rule tests.
 *
 * Reproduces the rules from
 * `crates/fc-platform/src/client/operations/delete.rs:77-136`:
 *
 *   - Refuse delete when principals still have this as their home client.
 *   - Refuse delete when access grants or application configs reference
 *     this client.
 *
 * Verifies BLOCKER #3 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createDeleteClientUseCase } from "../application/client/delete-client.js";
import type { ClientRepository } from "../infrastructure/persistence/repositories/client-repository.js";
import type { Client } from "../domain/index.js";

function makeClient(): Client {
	return {
		id: "cli_01HZX1AB000000000000000000",
		name: "Acme Corp",
		identifier: "acme",
		status: "ACTIVE",
		statusReason: null,
		statusChangedAt: null,
		notes: [],
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
	};
}

interface RefCounts {
	homePrincipals?: number;
	grants?: number;
	configs?: number;
}

function makeRepo(opts: {
	client?: Client | null;
	counts?: RefCounts;
} = {}): ClientRepository {
	const client = opts.client === undefined ? makeClient() : opts.client;
	const counts = opts.counts ?? {};
	return {
		findById: vi.fn(async () => client ?? undefined),
		countHomePrincipals: vi.fn(async () => counts.homePrincipals ?? 0),
		countAccessGrants: vi.fn(async () => counts.grants ?? 0),
		countClientConfigs: vi.fn(async () => counts.configs ?? 0),
	} as unknown as ClientRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {
		commitDelete: vi.fn(async (_agg, event) =>
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

describe("delete-client", () => {
	it("deletes a client with no references", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo(),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ clientId: "cli_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commitDelete).toHaveBeenCalledOnce();
	});

	it("refuses delete when principals have this as home client", async () => {
		// BLOCKER #3 (a) — silently re-scoping users is the worst symptom.
		const uow = makeUnitOfWork();
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo({ counts: { homePrincipals: 7 } }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ clientId: "cli_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CLIENT_HAS_PRINCIPALS");
			expect(result.error.message).toContain("7");
			expect(result.error.message).toContain("acme");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});

	it("refuses delete when access grants reference the client", async () => {
		// BLOCKER #3 (b)
		const uow = makeUnitOfWork();
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo({ counts: { grants: 3 } }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ clientId: "cli_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CLIENT_HAS_REFERENCES");
			expect(result.error.message).toContain("3 access grants");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});

	it("refuses delete when application configs reference the client", async () => {
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo({ counts: { configs: 2 } }),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ clientId: "cli_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CLIENT_HAS_REFERENCES");
			expect(result.error.message).toContain("2 application configs");
		}
	});

	it("lists all reference types in the error when both apply", async () => {
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo({ counts: { grants: 4, configs: 1 } }),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ clientId: "cli_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.message).toContain("4 access grants");
			expect(result.error.message).toContain("1 application configs");
		}
	});

	it("prefers the home-principal error over reference errors when both apply", async () => {
		// Home-principal check runs first (matches Rust ordering). Asserting
		// this so a future refactor doesn't quietly swap the order — the
		// message a user sees should always point at the more serious issue.
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo({
				counts: { homePrincipals: 1, grants: 2 },
			}),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ clientId: "cli_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CLIENT_HAS_PRINCIPALS");
		}
	});

	it("preserves not-found behaviour for missing clients", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteClientUseCase({
			clientRepository: makeRepo({ client: null }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ clientId: "cli_missing_0000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CLIENT_NOT_FOUND");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});
});
