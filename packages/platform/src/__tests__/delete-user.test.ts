/**
 * Delete User — business-rule tests.
 *
 * Reproduces the "cannot delete your own account" rule from
 * `crates/fc-platform/src/principal/operations/delete.rs:63-69`.
 * Verifies MAJOR #6 in BUSINESS_RULE_GAPS.md (which turned out to be a
 * single missing guard, not a missing operation — the TS use case
 * already existed and was in fact stricter, with a NOT_A_USER check).
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createDeleteUserUseCase } from "../application/principal/delete-user/use-case.js";
import type { PrincipalRepository } from "../infrastructure/persistence/repositories/principal-repository.js";
import { PrincipalType, type Principal } from "../domain/index.js";

const ACTING_PRINCIPAL = "prn_admin0000000000000000000";
const TARGET_USER = "prn_target000000000000000000";

function makeUser(id: string, type: string = PrincipalType.USER): Principal {
	return {
		id,
		type,
		scope: "CLIENT",
		clientId: "cli_01HZX1AB000000000000000000",
		applicationId: null,
		name: "Target User",
		active: true,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
		userIdentity: {
			email: "target@example.com",
		},
		serviceAccount: null,
		roles: [],
		accessibleApplicationIds: [],
	} as unknown as Principal;
}

function makeRepo(principal: Principal | null): PrincipalRepository {
	return {
		findById: vi.fn(async () => principal ?? undefined),
	} as unknown as PrincipalRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {
		commitDelete: vi.fn(async (_agg, event) =>
			Result.success(RESULT_SUCCESS_TOKEN, event),
		),
	} as unknown as UnitOfWork;
}

function makeContext(principalId = ACTING_PRINCIPAL): ExecutionContext {
	return {
		correlationId: "cor_test",
		principalId,
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

describe("delete-user", () => {
	it("deletes another user", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteUserUseCase({
			principalRepository: makeRepo(makeUser(TARGET_USER)),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ userId: TARGET_USER },
			makeContext(ACTING_PRINCIPAL),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commitDelete).toHaveBeenCalledOnce();
	});

	it("refuses to delete your own account", async () => {
		// MAJOR #6 — the gap this PR closes.
		const uow = makeUnitOfWork();
		const repo = makeRepo(makeUser(ACTING_PRINCIPAL));
		const useCase = createDeleteUserUseCase({
			principalRepository: repo,
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ userId: ACTING_PRINCIPAL },
			makeContext(ACTING_PRINCIPAL),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CANNOT_DELETE_SELF");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
		// Self-check short-circuits before the repository lookup.
		expect(repo.findById).not.toHaveBeenCalled();
	});

	it("refuses to delete a non-USER principal", async () => {
		// Pre-existing TS-only strictness; kept here as a regression guard.
		const useCase = createDeleteUserUseCase({
			principalRepository: makeRepo(makeUser(TARGET_USER, PrincipalType.SERVICE)),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ userId: TARGET_USER },
			makeContext(ACTING_PRINCIPAL),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("NOT_A_USER");
		}
	});

	it("returns not-found for a missing user", async () => {
		const useCase = createDeleteUserUseCase({
			principalRepository: makeRepo(null),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ userId: TARGET_USER },
			makeContext(ACTING_PRINCIPAL),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("USER_NOT_FOUND");
		}
	});

	it("rejects empty userId before any other check", async () => {
		const repo = makeRepo(makeUser(TARGET_USER));
		const useCase = createDeleteUserUseCase({
			principalRepository: repo,
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute({ userId: "" }, makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("USER_ID_REQUIRED");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});
});
