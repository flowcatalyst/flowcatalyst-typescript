/**
 * Sync Roles — business-rule tests.
 *
 * Reproduces the assignment-orphan guard from
 * `crates/fc-platform/src/role/operations/sync.rs:194-215`:
 *
 *   When `removeUnlisted` is set, an unlisted SDK-sourced role is only
 *   deleted if no principal still holds it. iam_principal_roles has no
 *   DB-level FK on role_name, so deleting a still-held role would orphan
 *   the assignment rows — the whole sync aborts with ROLE_HAS_ASSIGNMENTS.
 *
 * Verifies audit-pass-3 BLOCKER (role/sync-roles) in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createSyncRolesUseCase } from "../application/role/sync-roles/use-case.js";
import type {
	RoleRepository,
	ApplicationRepository,
} from "../infrastructure/persistence/index.js";
import { RoleSource, type AuthRole } from "../domain/index.js";

const APP_ID = "app_01HZX1AB000000000000000000";

function makeRole(overrides: Partial<AuthRole> = {}): AuthRole {
	return {
		id: "rol_01HZX1AB000000000000000000",
		applicationId: APP_ID,
		applicationCode: "orders",
		name: "orders:viewer",
		displayName: "Orders Viewer",
		description: null,
		permissions: ["orders:read"],
		source: RoleSource.SDK,
		clientManaged: false,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
		...overrides,
	};
}

function makeRepo(
	opts: {
		appRoles?: AuthRole[];
		assignmentsByName?: Record<string, number>;
		deleteById?: ReturnType<typeof vi.fn>;
	} = {},
): RoleRepository {
	const appRoles = opts.appRoles ?? [];
	const assignments = opts.assignmentsByName ?? {};
	return {
		findByName: vi.fn(async () => undefined),
		findByApplicationId: vi.fn(async () => appRoles),
		countAssignments: vi.fn(async (name: string) => assignments[name] ?? 0),
		insert: vi.fn(async () => {}),
		update: vi.fn(async () => {}),
		deleteById: opts.deleteById ?? vi.fn(async () => {}),
	} as unknown as RoleRepository;
}

function makeAppRepo(): ApplicationRepository {
	return {
		findByCode: vi.fn(async () => ({ id: APP_ID, code: "orders" })),
	} as unknown as ApplicationRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {
		commitOperations: vi.fn(async (event, _command, operations) => {
			await operations(undefined);
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

describe("sync-roles", () => {
	it("refuses to remove an unlisted SDK role that still has assignments", async () => {
		// BLOCKER — previously sync-roles deleted unlisted SDK roles
		// unconditionally, orphaning iam_principal_roles rows.
		const deleteById = vi.fn(async () => {});
		const uow = makeUnitOfWork();
		const useCase = createSyncRolesUseCase({
			roleRepository: makeRepo({
				appRoles: [
					makeRole({
						id: "rol_admin",
						name: "orders:admin",
						source: RoleSource.SDK,
					}),
				],
				assignmentsByName: { "orders:admin": 3 },
				deleteById,
			}),
			applicationRepository: makeAppRepo(),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{
				applicationCode: "orders",
				roles: [{ name: "viewer" }],
				removeUnlisted: true,
			},
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("ROLE_HAS_ASSIGNMENTS");
			expect(result.error.message).toContain("orders:admin");
			expect(result.error.message).toContain("3");
		}
		// The sync aborts before touching the transaction or deleting.
		expect(uow.commitOperations).not.toHaveBeenCalled();
		expect(deleteById).not.toHaveBeenCalled();
	});

	it("removes an unlisted SDK role when no principal holds it", async () => {
		const deleteById = vi.fn(async () => {});
		const useCase = createSyncRolesUseCase({
			roleRepository: makeRepo({
				appRoles: [
					makeRole({
						id: "rol_admin",
						name: "orders:admin",
						source: RoleSource.SDK,
					}),
				],
				assignmentsByName: { "orders:admin": 0 },
				deleteById,
			}),
			applicationRepository: makeAppRepo(),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{
				applicationCode: "orders",
				roles: [{ name: "viewer" }],
				removeUnlisted: true,
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(deleteById).toHaveBeenCalledWith("rol_admin", undefined);
	});

	it("does not check assignments for unlisted non-SDK roles", async () => {
		// CODE/DATABASE roles are never removed by sync, so their assignments
		// are irrelevant — the guard must not fire on them.
		const repo = makeRepo({
			appRoles: [
				makeRole({
					id: "rol_owner",
					name: "orders:owner",
					source: RoleSource.DATABASE,
				}),
			],
			assignmentsByName: { "orders:owner": 9 },
		});
		const useCase = createSyncRolesUseCase({
			roleRepository: repo,
			applicationRepository: makeAppRepo(),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{
				applicationCode: "orders",
				roles: [{ name: "viewer" }],
				removeUnlisted: true,
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(repo.countAssignments).not.toHaveBeenCalled();
	});

	it("skips the assignment guard entirely when removeUnlisted is false", async () => {
		const repo = makeRepo({
			appRoles: [
				makeRole({
					id: "rol_admin",
					name: "orders:admin",
					source: RoleSource.SDK,
				}),
			],
			assignmentsByName: { "orders:admin": 5 },
		});
		const useCase = createSyncRolesUseCase({
			roleRepository: repo,
			applicationRepository: makeAppRepo(),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{
				applicationCode: "orders",
				roles: [{ name: "viewer" }],
				removeUnlisted: false,
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(repo.countAssignments).not.toHaveBeenCalled();
	});
});
