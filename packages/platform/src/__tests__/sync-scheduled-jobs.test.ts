/**
 * Sync ScheduledJobs — reconcile-semantics tests.
 *
 * Reproduces two rules from
 * `crates/fc-platform/src/scheduled_job/operations/sync.rs`:
 *   - re-listed non-ACTIVE jobs are re-activated (:182-187)
 *   - archiveUnlisted archives ACTIVE jobs absent from the payload (:222-231)
 *
 * Verifies audit-pass-3 MAJOR #12 in BUSINESS_RULE_GAPS.md.
 */

import { describe, it, expect, vi } from "vitest";
import { Result, type ExecutionContext } from "@flowcatalyst/application";
import type { Logger } from "@flowcatalyst/logging";
import { RESULT_SUCCESS_TOKEN, type UnitOfWork } from "@flowcatalyst/domain";

import { createSyncScheduledJobsUseCase } from "../application/scheduled-job/sync-scheduled-jobs.js";
import type { ScheduledJobRepository } from "../infrastructure/persistence/index.js";
import type { ScheduledJob } from "../domain/index.js";

function makeJob(overrides: Partial<ScheduledJob> = {}): ScheduledJob {
	return {
		id: "sjb_x",
		clientId: null,
		code: "j",
		name: "J",
		description: null,
		crons: ["0 0 * * *"],
		timezone: "UTC",
		payload: null,
		concurrent: false,
		tracksCompletion: false,
		timeoutSeconds: null,
		deliveryMaxAttempts: 3,
		targetUrl: null,
		status: "ACTIVE",
		version: 1,
		createdBy: null,
		updatedBy: null,
		createdAt: new Date("2026-01-01T00:00:00Z"),
		updatedAt: new Date("2026-01-01T00:00:00Z"),
		...overrides,
	} as unknown as ScheduledJob;
}

function makeRepo(opts: {
	byCode?: Record<string, ScheduledJob>;
	scope?: ScheduledJob[];
	update?: ReturnType<typeof vi.fn>;
	insert?: ReturnType<typeof vi.fn>;
}): ScheduledJobRepository {
	const byCode = opts.byCode ?? {};
	return {
		findByCode: vi.fn(async (_clientId: string | null, code: string) => byCode[code]),
		findByClientScope: vi.fn(async () => opts.scope ?? []),
		insert: opts.insert ?? vi.fn(async () => {}),
		update: opts.update ?? vi.fn(async () => {}),
	} as unknown as ScheduledJobRepository;
}

function makeUnitOfWork(): UnitOfWork {
	return {
		commitOperations: vi.fn(async (event, _cmd, ops) => {
			await ops(undefined);
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

const ITEM = { code: "j1", name: "Job 1", crons: ["0 0 * * *"] };

describe("sync-scheduled-jobs reconcile", () => {
	it("re-activates a re-listed paused job", async () => {
		const update = vi.fn(async () => {});
		const useCase = createSyncScheduledJobsUseCase({
			scheduledJobRepository: makeRepo({
				byCode: { j1: makeJob({ id: "sjb_j1", code: "j1", status: "PAUSED" }) },
				update,
			}),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ clientId: null, scheduledJobs: [ITEM] },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(update).toHaveBeenCalledOnce();
		const persisted = update.mock.calls[0]?.[0] as ScheduledJob;
		expect(persisted.status).toBe("ACTIVE");
	});

	it("does not archive unlisted jobs by default", async () => {
		const repo = makeRepo({
			byCode: { j1: makeJob({ id: "sjb_j1", code: "j1" }) },
			scope: [makeJob({ id: "sjb_stale", code: "stale", status: "ACTIVE" })],
		});
		const useCase = createSyncScheduledJobsUseCase({
			scheduledJobRepository: repo,
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ clientId: null, scheduledJobs: [ITEM] },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		expect(repo.findByClientScope).not.toHaveBeenCalled();
	});

	it("archives only ACTIVE unlisted jobs when archiveUnlisted is set", async () => {
		const update = vi.fn(async () => {});
		const useCase = createSyncScheduledJobsUseCase({
			scheduledJobRepository: makeRepo({
				// j1 is created (not found), so it appears in scope as ACTIVE/listed
				scope: [
					makeJob({ id: "sjb_keep", code: "j1", status: "ACTIVE" }),
					makeJob({ id: "sjb_stale", code: "stale", status: "ACTIVE" }),
					makeJob({ id: "sjb_old", code: "old", status: "ARCHIVED" }),
				],
				update,
			}),
			unitOfWork: makeUnitOfWork(),
		});

		const result = await useCase.execute(
			{ clientId: null, scheduledJobs: [ITEM], archiveUnlisted: true },
			makeContext(),
		);

		expect(Result.isSuccess(result)).toBe(true);
		if (Result.isSuccess(result)) {
			expect(result.value.getData().archived).toBe(1);
		}
		// Only the ACTIVE, unlisted "stale" job is archived.
		expect(update).toHaveBeenCalledOnce();
		const persisted = update.mock.calls[0]?.[0] as ScheduledJob;
		expect(persisted.id).toBe("sjb_stale");
		expect(persisted.status).toBe("ARCHIVED");
	});
});
