/**
 * Sync Subscriptions — business-rule tests.
 *
 * Reproduces the per-application scoping of the removeUnlisted delete
 * sweep from `crates/fc-platform/src/subscription/operations/sync.rs`
 * (Rust scopes deletion to `find_by_application_code`):
 *
 *   findAnchorLevel() returns every anchor-level (clientId null)
 *   subscription regardless of owning application. The unlisted-delete
 *   sweep must therefore filter by command.applicationCode, or one
 *   application's sync deletes another application's anchor-level API
 *   subscriptions.
 *
 * Verifies audit-pass-3 BLOCKER #16 (cross-application subscription
 * deletion) in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createSyncSubscriptionsUseCase } from "../application/subscription/sync-subscriptions/use-case.js";
import type {
	SubscriptionRepository,
	DispatchPoolRepository,
	ConnectionRepository,
} from "../infrastructure/persistence/index.js";
import type { Subscription } from "../domain/index.js";

/** Minimal anchor-level subscription stub — the sweep reads only these fields. */
function anchorSub(
	id: string,
	code: string,
	applicationCode: string,
	source: "API" | "UI" = "API",
): Subscription {
	return { id, code, applicationCode, source } as unknown as Subscription;
}

function makeSubRepo(opts: {
	anchorSubs: Subscription[];
	deleteById?: ReturnType<typeof vi.fn>;
}): SubscriptionRepository {
	return {
		findByCodeAndClient: vi.fn(async () => undefined), // synced items take create path
		findAnchorLevel: vi.fn(async () => opts.anchorSubs),
		insert: vi.fn(async () => {}),
		update: vi.fn(async () => {}),
		deleteById: opts.deleteById ?? vi.fn(async () => {}),
	} as unknown as SubscriptionRepository;
}

function makeDispatchPoolRepo(): DispatchPoolRepository {
	return {
		findByCodeAndClientId: vi.fn(async () => undefined),
	} as unknown as DispatchPoolRepository;
}

function makeConnectionRepo(): ConnectionRepository {
	return { findByIds: vi.fn(async () => []) } as unknown as ConnectionRepository;
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

const SYNCED_ITEM = {
	code: "a-new",
	name: "A New",
	endpoint: "https://app-a.test/wh",
	eventTypes: [{ eventTypeId: null, eventTypeCode: "order.placed", specVersion: null }],
};

describe("sync-subscriptions removeUnlisted scoping", () => {
	it("does not delete another application's anchor-level subscriptions", async () => {
		// BLOCKER #16 — the sweep previously ignored applicationCode and
		// would delete app-b's anchor-level API subs during an app-a sync.
		const deleteById = vi.fn(async () => {});
		const subRepo = makeSubRepo({
			anchorSubs: [
				anchorSub("sub_a_old", "a-old", "app-a"), // app-a, unlisted → delete
				anchorSub("sub_b", "b1", "app-b"), // app-b → must survive
			],
			deleteById,
		});

		const result = await createSyncSubscriptionsUseCase({
			subscriptionRepository: subRepo,
			dispatchPoolRepository: makeDispatchPoolRepo(),
			connectionRepository: makeConnectionRepo(),
			unitOfWork: makeUnitOfWork(),
		}).execute(
			{
				applicationCode: "app-a",
				subscriptions: [SYNCED_ITEM],
				removeUnlisted: true,
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		// app-a's own unlisted sub is removed...
		expect(deleteById).toHaveBeenCalledWith("sub_a_old", undefined);
		// ...but app-b's sub is never touched.
		expect(deleteById).not.toHaveBeenCalledWith("sub_b", undefined);
		expect(deleteById).toHaveBeenCalledTimes(1);
	});

	it("leaves UI-sourced anchor subscriptions alone even for the same app", async () => {
		const deleteById = vi.fn(async () => {});
		const subRepo = makeSubRepo({
			anchorSubs: [anchorSub("sub_ui", "ui-managed", "app-a", "UI")],
			deleteById,
		});

		const result = await createSyncSubscriptionsUseCase({
			subscriptionRepository: subRepo,
			dispatchPoolRepository: makeDispatchPoolRepo(),
			connectionRepository: makeConnectionRepo(),
			unitOfWork: makeUnitOfWork(),
		}).execute(
			{
				applicationCode: "app-a",
				subscriptions: [SYNCED_ITEM],
				removeUnlisted: true,
			},
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(deleteById).not.toHaveBeenCalled();
	});
});
