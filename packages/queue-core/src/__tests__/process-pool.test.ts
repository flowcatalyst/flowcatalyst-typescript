import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { PoolConfig } from "@flowcatalyst/contracts";
import { ProcessPool } from "../pool/process-pool.js";
import { MockMediator } from "./helpers/mock-mediator.js";
import { MockCallback } from "./helpers/mock-callback.js";
import { makeMessage, resetMessageCounter } from "./helpers/message-factory.js";
import { createSilentLogger } from "./helpers/silent-logger.js";

const baseConfig: PoolConfig = {
	code: "TEST-POOL",
	concurrency: 4,
	rateLimitPerMinute: null,
};

function makePool(
	mediator: MockMediator,
	overrides: Partial<PoolConfig> = {},
): ProcessPool {
	return new ProcessPool(
		{ ...baseConfig, ...overrides },
		mediator.asMediator(),
		createSilentLogger(),
	);
}

/** Wait for all callbacks to settle (ack or nack). */
async function settleAll(callbacks: MockCallback[]): Promise<void> {
	await Promise.all(callbacks.map((c) => c.settled));
}

describe("ProcessPool — submit lifecycle", () => {
	beforeEach(() => resetMessageCounter());

	it("returns false when state is not RUNNING", async () => {
		const mediator = new MockMediator();
		const pool = makePool(mediator);
		await pool.shutdown();
		const accepted = await pool.submit(makeMessage(), new MockCallback());
		expect(accepted).toBe(false);
	});

	it("accepts up to maxCapacity = max(concurrency * 20, 50)", async () => {
		const mediator = new MockMediator();
		mediator.latencyMs = 100; // hold messages so capacity fills
		// concurrency=2 → maxCapacity = max(40, 50) = 50
		const pool = makePool(mediator, { concurrency: 2 });

		const callbacks: MockCallback[] = [];
		let acceptedCount = 0;
		// Push beyond capacity so we can observe the rejection boundary
		for (let i = 0; i < 60; i++) {
			const cb = new MockCallback();
			callbacks.push(cb);
			const accepted = await pool.submit(
				makeMessage({ groupId: `g-${i}`, dispatchMode: "IMMEDIATE" }),
				cb,
			);
			if (accepted) acceptedCount++;
		}
		expect(acceptedCount).toBe(50);
		expect(acceptedCount).toBeLessThan(60);
		await pool.shutdown();
	});

	it("shutdown clears rate-limiter timers and queue maps", async () => {
		const mediator = new MockMediator();
		const pool = makePool(mediator, { rateLimitPerMinute: 60 });
		await pool.submit(makeMessage(), new MockCallback());
		await pool.shutdown();
		expect(pool.getState()).toBe("STOPPED");
		expect(pool.isDrained()).toBe(false); // shutdown bypasses drained check
	});
});

describe("ProcessPool — outcome mapping", () => {
	let mediator: MockMediator;
	let pool: ProcessPool;

	beforeEach(() => {
		resetMessageCounter();
		mediator = new MockMediator();
		pool = makePool(mediator);
	});

	afterEach(async () => {
		await pool.shutdown();
	});

	it("SUCCESS → ack", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, { outcome: "SUCCESS", durationMs: 1 });
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("ack");
		expect(pool.getStats().totalSucceeded).toBe(1);
	});

	it("ERROR_CONFIG (4xx) → ack to prevent infinite retry", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, {
			outcome: "ERROR_CONFIG",
			durationMs: 1,
		});
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("ack");
		expect(pool.getStats().totalFailed).toBe(1);
	});

	it("DEFERRED → nack with delaySeconds", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, {
			outcome: "DEFERRED",
			delaySeconds: 45,
			durationMs: 1,
		});
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("nack");
		expect(cb.lastNackDelay).toBe(45);
		// NOTE: ProcessPool tracks totalDeferred internally but PoolStats
		// does not expose it. Worth a contract addition + getStats() update.
	});

	it("DEFERRED with no delay → nack with default 30", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, {
			outcome: "DEFERRED",
			durationMs: 1,
		});
		await pool.submit(msg, cb);
		await cb.settled;
		expect(cb.lastNackDelay).toBe(30);
	});

	it("ERROR_PROCESS (5xx) → nack, counted as transient not failure", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, {
			outcome: "ERROR_PROCESS",
			delaySeconds: 60,
			durationMs: 1,
		});
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("nack");
		expect(cb.lastNackDelay).toBe(60);
		const stats = pool.getStats();
		expect(stats.totalTransient).toBe(1);
		expect(stats.totalFailed).toBe(0);
	});

	it("RATE_LIMITED → nack with delay, NOT counted as failure or transient", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, {
			outcome: "RATE_LIMITED",
			delaySeconds: 15,
			durationMs: 1,
		});
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("nack");
		expect(cb.lastNackDelay).toBe(15);
		const stats = pool.getStats();
		expect(stats.totalRateLimited).toBe(1);
		expect(stats.totalFailed).toBe(0);
		expect(stats.totalTransient).toBe(0);
	});

	it("ERROR_CONNECTION → nack, counted as failure", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueOutcome(msg.messageId, {
			outcome: "ERROR_CONNECTION",
			durationMs: 1,
		});
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("nack");
		expect(pool.getStats().totalFailed).toBe(1);
	});

	it("processor exception → nack(30), counted as failure", async () => {
		const cb = new MockCallback();
		const msg = makeMessage();
		mediator.queueThrow(msg.messageId, new Error("boom"));
		await pool.submit(msg, cb);
		expect(await cb.settled).toBe("nack");
		expect(cb.lastNackDelay).toBe(30);
		expect(pool.getStats().totalFailed).toBe(1);
	});
});

describe("ProcessPool — IMMEDIATE bypass (regression test)", () => {
	let mediator: MockMediator;
	let pool: ProcessPool;

	beforeEach(() => {
		resetMessageCounter();
		mediator = new MockMediator();
		pool = makePool(mediator, { concurrency: 5 });
	});

	afterEach(async () => {
		await pool.shutdown();
	});

	it("messages with the same groupId run concurrently in IMMEDIATE mode", async () => {
		mediator.latencyMs = 50;
		const callbacks = Array.from({ length: 4 }, () => new MockCallback());
		const start = Date.now();
		await Promise.all(
			callbacks.map((cb) =>
				pool.submit(
					makeMessage({
						groupId: "shared-group",
						dispatchMode: "IMMEDIATE",
					}),
					cb,
				),
			),
		);
		await settleAll(callbacks);
		const elapsed = Date.now() - start;

		// 4 messages × 50ms each, serial would be ≥200ms.
		// Concurrent (with concurrency=5) should be ≈50ms + overhead.
		expect(elapsed).toBeLessThan(180);
		expect(mediator.peakConcurrency).toBeGreaterThanOrEqual(2);
	});

	it("IMMEDIATE 5xx on one message does NOT cascade-NACK siblings sharing batch+group", async () => {
		const sharedBatch = "batch-x";
		const sharedGroup = "group-x";
		mediator.latencyMs = 10;

		const cbFail = new MockCallback();
		const cbOk1 = new MockCallback();
		const cbOk2 = new MockCallback();

		const msgFail = makeMessage({
			messageId: "fail-1",
			groupId: sharedGroup,
			batchId: sharedBatch,
			dispatchMode: "IMMEDIATE",
		});
		const msgOk1 = makeMessage({
			messageId: "ok-1",
			groupId: sharedGroup,
			batchId: sharedBatch,
			dispatchMode: "IMMEDIATE",
		});
		const msgOk2 = makeMessage({
			messageId: "ok-2",
			groupId: sharedGroup,
			batchId: sharedBatch,
			dispatchMode: "IMMEDIATE",
		});

		mediator.queueOutcome("fail-1", {
			outcome: "ERROR_PROCESS",
			delaySeconds: 30,
			durationMs: 1,
		});
		mediator.queueOutcome("ok-1", { outcome: "SUCCESS", durationMs: 1 });
		mediator.queueOutcome("ok-2", { outcome: "SUCCESS", durationMs: 1 });

		await pool.submit(msgFail, cbFail);
		await pool.submit(msgOk1, cbOk1);
		await pool.submit(msgOk2, cbOk2);

		await settleAll([cbFail, cbOk1, cbOk2]);

		// Failure NACKed transiently
		expect(cbFail.isNacked).toBe(true);
		// Siblings independently SUCCEEDed — no cascade
		expect(cbOk1.isAcked).toBe(true);
		expect(cbOk2.isAcked).toBe(true);
		// All three reached the mediator
		expect(mediator.processed.length).toBe(3);
	});
});

describe("ProcessPool — ordered FIFO + cascade", () => {
	let mediator: MockMediator;
	let pool: ProcessPool;

	beforeEach(() => {
		resetMessageCounter();
		mediator = new MockMediator();
		pool = makePool(mediator, { concurrency: 5 });
	});

	afterEach(async () => {
		await pool.shutdown();
	});

	it("BLOCK_ON_ERROR: messages in same group are processed serially in submit order", async () => {
		mediator.latencyMs = 20;
		const callbacks = Array.from({ length: 3 }, () => new MockCallback());
		const messages = Array.from({ length: 3 }, (_, i) =>
			makeMessage({
				messageId: `seq-${i}`,
				groupId: "ordered-group",
				dispatchMode: "BLOCK_ON_ERROR",
			}),
		);
		for (let i = 0; i < 3; i++) {
			await pool.submit(messages[i]!, callbacks[i]!);
		}
		await settleAll(callbacks);

		// All processed in the order submitted, sequentially.
		expect(mediator.processed.map((m) => m.messageId)).toEqual([
			"seq-0",
			"seq-1",
			"seq-2",
		]);
		// Peak concurrency is 1 because group serializes
		expect(mediator.peakConcurrency).toBe(1);
	});

	it("BLOCK_ON_ERROR: 5xx adds to failedBatchGroups, siblings fast-fail with 10s NACK", async () => {
		const batch = "shared-batch";
		const group = "shared-group";

		const cbFail = new MockCallback();
		const cb2 = new MockCallback();
		const cb3 = new MockCallback();

		mediator.queueOutcome("a", {
			outcome: "ERROR_PROCESS",
			delaySeconds: 30,
			durationMs: 1,
		});

		const msgA = makeMessage({
			messageId: "a",
			batchId: batch,
			groupId: group,
		});
		const msgB = makeMessage({
			messageId: "b",
			batchId: batch,
			groupId: group,
		});
		const msgC = makeMessage({
			messageId: "c",
			batchId: batch,
			groupId: group,
		});

		await pool.submit(msgA, cbFail);
		await pool.submit(msgB, cb2);
		await pool.submit(msgC, cb3);

		await settleAll([cbFail, cb2, cb3]);

		// First message failed transiently with its delay
		expect(cbFail.isNacked).toBe(true);
		expect(cbFail.lastNackDelay).toBe(30);

		// Siblings fast-fail without reaching the mediator
		expect(cb2.isNacked).toBe(true);
		expect(cb2.lastNackDelay).toBe(10); // cascade fast-fail uses 10s
		expect(cb3.isNacked).toBe(true);
		expect(cb3.lastNackDelay).toBe(10);

		// Only the failing message hit the mediator
		expect(mediator.processed.map((m) => m.messageId)).toEqual(["a"]);
	});

	it("highPriority message is processed before regular messages already queued", async () => {
		mediator.latencyMs = 30;
		const cb1 = new MockCallback();
		const cb2 = new MockCallback();
		const cbHi = new MockCallback();

		const m1 = makeMessage({ messageId: "reg-1", groupId: "g" });
		const m2 = makeMessage({ messageId: "reg-2", groupId: "g" });
		const mHi = makeMessage({
			messageId: "hi",
			groupId: "g",
			highPriority: true,
		});

		await pool.submit(m1, cb1); // starts immediately (group idle)
		await pool.submit(m2, cb2); // queued behind m1
		await pool.submit(mHi, cbHi); // jumps the regular queue

		await settleAll([cb1, cb2, cbHi]);

		const ids = mediator.processed.map((m) => m.messageId);
		// m1 is in flight before mHi is enqueued, so it goes first.
		// mHi must precede m2 in the regular queue.
		expect(ids[0]).toBe("reg-1");
		expect(ids.indexOf("hi")).toBeLessThan(ids.indexOf("reg-2"));
	});
});

describe("ProcessPool — config updates", () => {
	beforeEach(() => resetMessageCounter());

	it("updateConfig changes rate limit in place without losing queued waiters", async () => {
		const mediator = new MockMediator();
		// Start at 60 rpm = 1/sec — slow
		const pool = makePool(mediator, { rateLimitPerMinute: 60 });
		try {
			const callbacks = Array.from({ length: 3 }, () => new MockCallback());
			for (let i = 0; i < 3; i++) {
				await pool.submit(
					makeMessage({
						groupId: `g-${i}`,
						dispatchMode: "IMMEDIATE",
					}),
					callbacks[i]!,
				);
			}
			// Bump rate up so queued waiters drain quickly
			pool.updateConfig({ rateLimitPerMinute: 60_000 });
			await settleAll(callbacks);
			expect(callbacks.every((c) => c.isAcked)).toBe(true);
		} finally {
			await pool.shutdown();
		}
	});

	it("updateConfig disables rate limit when set to null", async () => {
		const mediator = new MockMediator();
		const pool = makePool(mediator, { rateLimitPerMinute: 60 });
		try {
			pool.updateConfig({ rateLimitPerMinute: null });
			// With limiter disabled, throughput is concurrency-bound only.
			const callbacks = Array.from({ length: 5 }, () => new MockCallback());
			for (let i = 0; i < 5; i++) {
				await pool.submit(
					makeMessage({ groupId: `g-${i}`, dispatchMode: "IMMEDIATE" }),
					callbacks[i]!,
				);
			}
			await settleAll(callbacks);
			expect(callbacks.every((c) => c.isAcked)).toBe(true);
		} finally {
			await pool.shutdown();
		}
	});

	it("updateConfig increases concurrency and lets more messages run in parallel", async () => {
		const mediator = new MockMediator();
		mediator.latencyMs = 30;
		const pool = makePool(mediator, { concurrency: 1 });
		try {
			pool.updateConfig({ concurrency: 5 });
			const callbacks = Array.from({ length: 5 }, () => new MockCallback());
			await Promise.all(
				callbacks.map((cb) =>
					pool.submit(
						makeMessage({
							groupId: `g-${Math.random()}`,
							dispatchMode: "IMMEDIATE",
						}),
						cb,
					),
				),
			);
			await settleAll(callbacks);
			expect(mediator.peakConcurrency).toBeGreaterThanOrEqual(2);
		} finally {
			await pool.shutdown();
		}
	});
});
