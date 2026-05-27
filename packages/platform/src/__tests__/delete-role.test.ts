/**
 * Delete Role — business-rule tests.
 *
 * Reproduces the rules from
 * `crates/fc-platform/src/role/operations/delete.rs:80-110`:
 *
 *   - Only DATABASE-defined roles can be deleted (CODE and SDK rejected).
 *   - Refuse deletion when principals still hold the role.
 *
 * Verifies BLOCKER #2 and MINOR #7 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createDeleteRoleUseCase } from "../application/role/delete-role/use-case.js";
import type { RoleRepository } from "../infrastructure/persistence/repositories/role-repository.js";
import { RoleSource, type AuthRole } from "../domain/index.js";

function makeRole(overrides: Partial<AuthRole> = {}): AuthRole {
	return {
		id: "rol_01HZX1AB000000000000000000",
		applicationId: "app_01HZX1AB000000000000000000",
		applicationCode: "orders",
		name: "orders:viewer",
		displayName: "Orders Viewer",
		description: null,
		permissions: ["orders:read"],
		source: RoleSource.DATABASE,
		clientManaged: false,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
		...overrides,
	};
}

function makeRepo(opts: {
	role?: AuthRole | null;
	assignments?: number;
} = {}): RoleRepository {
	const role = opts.role === undefined ? makeRole() : opts.role;
	return {
		findById: vi.fn(async () => role ?? undefined),
		countAssignments: vi.fn(async () => opts.assignments ?? 0),
	} as unknown as RoleRepository;
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

describe("delete-role", () => {
	it("deletes a DATABASE-sourced role with no assignments", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteRoleUseCase({
			roleRepository: makeRepo(),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ roleId: "rol_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commitDelete).toHaveBeenCalledOnce();
	});

	it("refuses to delete a CODE-sourced role", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteRoleUseCase({
			roleRepository: makeRepo({
				role: makeRole({ source: RoleSource.CODE }),
			}),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ roleId: "rol_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CANNOT_DELETE_ROLE");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});

	it("refuses to delete an SDK-synced role", async () => {
		// MINOR #7 — previously TS blocked only CODE; Rust blocks SDK too.
		const uow = makeUnitOfWork();
		const useCase = createDeleteRoleUseCase({
			roleRepository: makeRepo({ role: makeRole({ source: RoleSource.SDK }) }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ roleId: "rol_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("CANNOT_DELETE_ROLE");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});

	it("refuses to delete a role with active assignments", async () => {
		// BLOCKER #2 — previously TS allowed delete despite assignments.
		const uow = makeUnitOfWork();
		const useCase = createDeleteRoleUseCase({
			roleRepository: makeRepo({ assignments: 4 }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ roleId: "rol_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("ROLE_HAS_ASSIGNMENTS");
			expect(result.error.message).toContain("4");
			expect(result.error.message).toContain("orders:viewer");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});

	it("preserves the not-found behaviour for missing roles", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteRoleUseCase({
			roleRepository: makeRepo({ role: null }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ roleId: "rol_missing_0000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("ROLE_NOT_FOUND");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});

	it("rejects empty role IDs without checking the repository", async () => {
		const repo = makeRepo();
		const useCase = createDeleteRoleUseCase({
			roleRepository: repo,
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute({ roleId: "" }, makeContext());

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("ROLE_ID_REQUIRED");
		}
		expect(repo.findById).not.toHaveBeenCalled();
	});
});
