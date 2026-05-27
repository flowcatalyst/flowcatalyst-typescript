/**
 * Delete Application — reference-count blocker tests.
 *
 * Reproduces the rule from
 * `crates/fc-platform/src/application/operations/delete.rs:85-143`:
 * refuse deletion while any access grant, client config, service
 * account, application role, or principal ref still references the
 * application.
 *
 * Verifies the gap fix logged in BUSINESS_RULE_GAPS.md (item BLOCKER #1).
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createDeleteApplicationUseCase } from "../application/app/delete-application.js";
import type { ApplicationRepository } from "../infrastructure/persistence/repositories/application-repository.js";
import {
	ApplicationTypeEnum,
	type Application,
} from "../domain/index.js";

function makeApplication(): Application {
	return {
		id: "app_01HZX1AB000000000000000000",
		type: ApplicationTypeEnum.APPLICATION,
		code: "orders",
		name: "Orders",
		description: null,
		iconUrl: null,
		website: null,
		logo: null,
		logoMimeType: null,
		defaultBaseUrl: null,
		serviceAccountId: null,
		active: true,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
	};
}

interface RefCounts {
	grants?: number;
	configs?: number;
	sas?: number;
	roles?: number;
	principalRefs?: number;
}

function makeRepo(opts: {
	application?: Application | null;
	counts?: RefCounts;
} = {}): ApplicationRepository {
	const app = opts.application === undefined ? makeApplication() : opts.application;
	const counts = opts.counts ?? {};
	return {
		findById: vi.fn(async () => app ?? undefined),
		countAccessGrants: vi.fn(async () => counts.grants ?? 0),
		countClientConfigs: vi.fn(async () => counts.configs ?? 0),
		countServiceAccounts: vi.fn(async () => counts.sas ?? 0),
		countRoles: vi.fn(async () => counts.roles ?? 0),
		countPrincipalRefs: vi.fn(async () => counts.principalRefs ?? 0),
	} as unknown as ApplicationRepository;
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

describe("delete-application — reference-count blocker", () => {
	it("succeeds when no references point at the application", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteApplicationUseCase({
			applicationRepository: makeRepo(),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ applicationId: "app_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commitDelete).toHaveBeenCalledOnce();
	});

	const cases: Array<{ name: string; counts: RefCounts; needle: string }> = [
		{
			name: "blocks delete when access grants reference the application",
			counts: { grants: 3 },
			needle: "3 access grants",
		},
		{
			name: "blocks delete when client configs reference the application",
			counts: { configs: 1 },
			needle: "1 client configs",
		},
		{
			name: "blocks delete when service accounts reference the application",
			counts: { sas: 2 },
			needle: "2 service accounts",
		},
		{
			name: "blocks delete when application roles still exist",
			counts: { roles: 5 },
			needle: "5 application roles",
		},
		{
			name: "blocks delete when principals reference the application",
			counts: { principalRefs: 1 },
			needle: "1 principal refs",
		},
	];

	for (const { name, counts, needle } of cases) {
		it(name, async () => {
			const uow = makeUnitOfWork();
			const useCase = createDeleteApplicationUseCase({
				applicationRepository: makeRepo({ counts }),
				unitOfWork: uow,
			});

			const result = await useCase.execute(
				{ applicationId: "app_01HZX1AB000000000000000000" },
				makeContext(),
			);

			expect(Result.isFailure(result)).toBe(true);
			if (Result.isFailure(result)) {
				expect(result.error.code).toBe("APPLICATION_HAS_REFERENCES");
				expect(result.error.message).toContain(needle);
			}
			expect(uow.commitDelete).not.toHaveBeenCalled();
		});
	}

	it("lists every blocker in the error when multiple reference types exist", async () => {
		const useCase = createDeleteApplicationUseCase({
			applicationRepository: makeRepo({
				counts: { grants: 2, configs: 1, sas: 3, roles: 4, principalRefs: 5 },
			}),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ applicationId: "app_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			const message = result.error.message;
			expect(message).toContain("2 access grants");
			expect(message).toContain("1 client configs");
			expect(message).toContain("3 service accounts");
			expect(message).toContain("4 application roles");
			expect(message).toContain("5 principal refs");
		}
	});

	it("preserves the not-found behaviour for missing applications", async () => {
		const uow = makeUnitOfWork();
		const useCase = createDeleteApplicationUseCase({
			applicationRepository: makeRepo({ application: null }),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ applicationId: "app_missing_0000000000000000" },
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("APPLICATION_NOT_FOUND");
		}
		expect(uow.commitDelete).not.toHaveBeenCalled();
	});
});
