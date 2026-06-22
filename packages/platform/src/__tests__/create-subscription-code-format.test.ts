/**
 * Create Subscription — code format regex tightening.
 *
 * Verifies MINOR #8 in BUSINESS_RULE_GAPS.md: the TS regex used to be
 * `^[a-z][a-z0-9-]*$`, which silently accepted codes ending in a
 * hyphen (e.g. "my-sub-") that Rust rejects. The fix tightens it to
 * `^[a-z][a-z0-9-]*[a-z0-9]$`, matching Rust
 * crates/fc-platform/src/subscription/operations/create.rs:114-119.
 *
 * Scoped to the regex; the bigger create-subscription happy path lives
 * elsewhere (this PR doesn't add general coverage for the use case).
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import type { UnitOfWork } from "@flowcatalyst/domain";

import { createCreateSubscriptionUseCase } from "../application/subscription/create-subscription.js";
import type { CreateSubscriptionCommand } from "../application/subscription/create-subscription.js";
import type {
	SubscriptionRepository,
	DispatchPoolRepository,
	ConnectionRepository,
} from "../infrastructure/persistence/index.js";

function stubRepos(): {
	subscriptionRepository: SubscriptionRepository;
	dispatchPoolRepository: DispatchPoolRepository;
	connectionRepository: ConnectionRepository;
	unitOfWork: UnitOfWork;
} {
	// The regex check is what we're testing — we don't care about the
	// downstream flow. existsByCodeAndClient is the first method called
	// after the regex passes; stubbing it to throw a sentinel lets us
	// distinguish "regex passed" from "regex rejected" cleanly.
	return {
		subscriptionRepository: {
			existsByCodeAndClient: vi.fn(async () => {
				throw new Error("PAST_REGEX");
			}),
		} as unknown as SubscriptionRepository,
		dispatchPoolRepository: {} as unknown as DispatchPoolRepository,
		connectionRepository: {} as unknown as ConnectionRepository,
		unitOfWork: {} as unknown as UnitOfWork,
	};
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

function commandWithCode(code: string): CreateSubscriptionCommand {
	return {
		code,
		name: "Test",
		endpoint: "https://example.com/wh",
		eventTypes: [{ eventTypeCode: "orders:order:placed", schemaVersion: null }],
	} as unknown as CreateSubscriptionCommand;
}

describe("create-subscription — code format (MINOR #8)", () => {
	const valid = ["a1", "abc", "my-sub", "my-sub-2", "user2"];
	const invalid = [
		"my-sub-", // trailing hyphen — the bug
		"-leading-hyphen",
		"A", // uppercase
		"My-Sub",
		"my_sub", // underscore
		"a", // too short (min 2)
		"1abc", // starts with digit
		"",
	];

	for (const code of valid) {
		it(`accepts "${code}"`, async () => {
			const useCase = createCreateSubscriptionUseCase(stubRepos());
			// Regex passes -> existsByCodeAndClient stub throws PAST_REGEX.
			// Regex fails -> use case returns a Result with INVALID_CODE_FORMAT.
			await expect(
				useCase.execute(commandWithCode(code), makeContext()),
			).rejects.toThrow("PAST_REGEX");
		});
	}

	for (const code of invalid) {
		it(`rejects "${code}"`, async () => {
			const useCase = createCreateSubscriptionUseCase(stubRepos());
			const result = await useCase.execute(commandWithCode(code), makeContext());
			expect(Result.isFailure(result)).toBe(true);
			if (Result.isFailure(result)) {
				// Empty string fails CODE_REQUIRED first; anything else fails
				// INVALID_CODE_FORMAT.
				expect(
					code === ""
						? ["CODE_REQUIRED"]
						: ["INVALID_CODE_FORMAT"],
				).toContain(result.error.code);
			}
		});
	}
});
