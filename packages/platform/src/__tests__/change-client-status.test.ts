/**
 * Change Client Status — suspend-guard tests.
 *
 * The TS op is a generic status setter; Rust splits activate/suspend into
 * separate use cases. Reproduces the suspend-specific guards from
 * `crates/fc-platform/src/client/operations/suspend.rs`:
 *   - reason required (:51-57) and <= 500 chars (:58-63)
 *   - cannot suspend an INACTIVE client (:101-107)
 * These apply only to the SUSPENDED transition; other transitions are
 * unaffected.
 *
 * Verifies audit-pass-3 MAJOR #17 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createChangeClientStatusUseCase } from "../application/client/change-client-status/use-case.js";
import type { ChangeClientStatusCommand } from "../application/client/change-client-status/command.js";
import type { ClientRepository } from "../infrastructure/persistence/index.js";
import { ClientStatus, type Client } from "../domain/index.js";

function makeClient(status: ClientStatus): Client {
	return { id: "cli_1", name: "Acme", status } as unknown as Client;
}

function makeRepo(client: Client | null): ClientRepository {
	return {
		findById: vi.fn(async () => client ?? undefined),
	} as unknown as ClientRepository;
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

function cmd(
	overrides: Partial<ChangeClientStatusCommand>,
): ChangeClientStatusCommand {
	return {
		clientId: "cli_1",
		newStatus: ClientStatus.SUSPENDED,
		reason: "fraud investigation",
		note: null,
		...overrides,
	} as ChangeClientStatusCommand;
}

describe("change-client-status suspend guards", () => {
	it("requires a reason when suspending", async () => {
		const repo = makeRepo(makeClient(ClientStatus.ACTIVE));
		const result = await createChangeClientStatusUseCase({
			clientRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(cmd({ reason: null }), makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("REASON_REQUIRED");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});

	it("rejects a suspension reason longer than 500 chars", async () => {
		const repo = makeRepo(makeClient(ClientStatus.ACTIVE));
		const result = await createChangeClientStatusUseCase({
			clientRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(cmd({ reason: "x".repeat(501) }), makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("REASON_TOO_LONG");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});

	it("cannot suspend an inactive client", async () => {
		const repo = makeRepo(makeClient(ClientStatus.INACTIVE));
		const result = await createChangeClientStatusUseCase({
			clientRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(cmd({}), makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CANNOT_SUSPEND_INACTIVE");
		}
	});

	it("does not require a reason for non-suspend transitions", async () => {
		// Reactivating (or any non-SUSPENDED target) must not be blocked by the
		// suspend-only reason guard. Reaches the not-found path here.
		const repo = makeRepo(null);
		const result = await createChangeClientStatusUseCase({
			clientRepository: repo,
			unitOfWork: makeUnitOfWork(),
		}).execute(
			cmd({ newStatus: ClientStatus.ACTIVE, reason: null }),
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CLIENT_NOT_FOUND");
		}
		expect(repo.findById).toHaveBeenCalledOnce();
	});
});
