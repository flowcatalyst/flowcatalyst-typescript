/**
 * Update Service Account — field length validations.
 *
 * Verifies MINOR #10 in BUSINESS_RULE_GAPS.md against
 * `crates/fc-platform/src/service_account/operations/update.rs:96-118`:
 * name must be 1-100 chars; description must be max 500 chars.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createUpdateServiceAccountUseCase } from "../application/service-account/update-service-account.js";
import type { PrincipalRepository } from "../infrastructure/persistence/repositories/principal-repository.js";
import type { Principal } from "../domain/index.js";

function makeServiceAccount(): Principal {
	return {
		id: "prn_01HZX1AB000000000000000000",
		type: "SERVICE",
		scope: null,
		clientId: null,
		applicationId: "app_01HZX1AB000000000000000000",
		name: "Orders Service",
		active: true,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
		userIdentity: null,
		serviceAccount: {
			code: "orders-service",
			description: null,
			whAuthType: "BEARER_TOKEN",
			whAuthTokenRef: null,
			whSigningSecretRef: null,
			whSigningAlgorithm: "HMAC_SHA256",
			whCredentialsCreatedAt: null,
			whCredentialsRegeneratedAt: null,
			lastUsedAt: null,
		},
		roles: [],
		accessibleApplicationIds: [],
	} as unknown as Principal;
}

function makeRepo(principal: Principal): PrincipalRepository {
	return {
		findById: vi.fn(async () => principal),
	} as unknown as PrincipalRepository;
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

describe("update-service-account — field length validation (MINOR #10)", () => {
	it("rejects empty (trimmed) name", async () => {
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{
				serviceAccountId: "prn_01HZX1AB000000000000000000",
				name: "   ",
			},
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("INVALID_NAME");
		}
	});

	it("rejects name longer than 100 characters", async () => {
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{
				serviceAccountId: "prn_01HZX1AB000000000000000000",
				name: "x".repeat(101),
			},
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("INVALID_NAME");
		}
	});

	it("accepts a name of exactly 100 characters", async () => {
		const uow = makeUnitOfWork();
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{
				serviceAccountId: "prn_01HZX1AB000000000000000000",
				name: "x".repeat(100),
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commit).toHaveBeenCalledOnce();
	});

	it("rejects description longer than 500 characters", async () => {
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{
				serviceAccountId: "prn_01HZX1AB000000000000000000",
				description: "y".repeat(501),
			},
			makeContext(),
		);

		expect(Result.isFailure(result)).toBe(true);
		if (Result.isFailure(result)) {
			expect(result.error.code).toBe("INVALID_DESCRIPTION");
		}
	});

	it("accepts a description of exactly 500 characters", async () => {
		const uow = makeUnitOfWork();
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{
				serviceAccountId: "prn_01HZX1AB000000000000000000",
				description: "y".repeat(500),
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(uow.commit).toHaveBeenCalledOnce();
	});

	it("treats null description as 'leave alone' (no length check)", async () => {
		// command.description === null means clear it; should not trip the
		// length check (null doesn't have .length > 500).
		const uow = makeUnitOfWork();
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{
				serviceAccountId: "prn_01HZX1AB000000000000000000",
				description: null,
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
	});

	it("skips both checks when neither field is supplied", async () => {
		const uow = makeUnitOfWork();
		const useCase = createUpdateServiceAccountUseCase({
			principalRepository: makeRepo(makeServiceAccount()),
			unitOfWork: uow,
		});

		const result = await useCase.execute(
			{ serviceAccountId: "prn_01HZX1AB000000000000000000" },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
	});
});
