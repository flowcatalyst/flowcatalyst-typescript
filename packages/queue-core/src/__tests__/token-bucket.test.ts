import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueueFullError, TokenBucket } from "../utils/token-bucket.js";

describe("TokenBucket", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("synchronous tryAcquire", () => {
		it("returns true when tokens are available", () => {
			const bucket = new TokenBucket({ ratePerMinute: 600, capacity: 5 });
			expect(bucket.tryAcquire()).toBe(true);
		});

		it("returns false when bucket is empty and not yet refilled", () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 });
			expect(bucket.tryAcquire()).toBe(true);
			// capacity=1, just used the only token; refill is 1/sec, no time passed
			expect(bucket.tryAcquire()).toBe(false);
		});

		it("returns true again after enough time has passed for a refill", () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 });
			expect(bucket.tryAcquire()).toBe(true);
			expect(bucket.tryAcquire()).toBe(false);
			// 60 rpm = 1 token/sec; advance 1.1s to be safe
			vi.advanceTimersByTime(1100);
			expect(bucket.tryAcquire()).toBe(true);
		});

		it("does not exceed capacity on long idle periods", () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 3 });
			// Drain
			expect(bucket.tryAcquire()).toBe(true);
			expect(bucket.tryAcquire()).toBe(true);
			expect(bucket.tryAcquire()).toBe(true);
			// Idle for an hour — should refill to capacity, not 60
			vi.advanceTimersByTime(60 * 60 * 1000);
			expect(bucket.availableTokens).toBeLessThanOrEqual(3);
			expect(bucket.tryAcquire()).toBe(true);
			expect(bucket.tryAcquire()).toBe(true);
			expect(bucket.tryAcquire()).toBe(true);
			expect(bucket.tryAcquire()).toBe(false);
		});
	});

	describe("async acquire", () => {
		it("resolves immediately when a token is available", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 600, capacity: 5 });
			await bucket.acquire(); // should not require timer advance
		});

		it("blocks until a token refills", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 });
			expect(bucket.tryAcquire()).toBe(true); // drain
			let resolved = false;
			const p = bucket.acquire().then(() => {
				resolved = true;
			});
			// Yield microtasks but no timer advance — should still be waiting
			await Promise.resolve();
			expect(resolved).toBe(false);
			// Advance just under refill window — still waiting
			await vi.advanceTimersByTimeAsync(900);
			expect(resolved).toBe(false);
			// Advance past refill — should resolve
			await vi.advanceTimersByTimeAsync(200);
			await p;
			expect(resolved).toBe(true);
		});

		it("drains queued waiters in FIFO order using a single shared timer", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 });
			expect(bucket.tryAcquire()).toBe(true); // drain initial token

			const order: number[] = [];
			const p1 = bucket.acquire().then(() => order.push(1));
			const p2 = bucket.acquire().then(() => order.push(2));
			const p3 = bucket.acquire().then(() => order.push(3));
			expect(bucket.queueDepth).toBe(3);

			// 1 token/sec — advance 3.1s so all three drain
			await vi.advanceTimersByTimeAsync(3100);
			await Promise.all([p1, p2, p3]);
			expect(order).toEqual([1, 2, 3]);
		});

		it("rejects with QueueFullError when maxQueueSize is exceeded", async () => {
			const bucket = new TokenBucket({
				ratePerMinute: 60,
				capacity: 1,
				maxQueueSize: 2,
			});
			expect(bucket.tryAcquire()).toBe(true); // drain
			const p1 = bucket.acquire(); // queued (1)
			const p2 = bucket.acquire(); // queued (2 — at limit)
			await expect(bucket.acquire()).rejects.toBeInstanceOf(QueueFullError);
			// Existing waiters still drain normally
			await vi.advanceTimersByTimeAsync(2100);
			await Promise.all([p1, p2]);
		});

		it("rejects when called on a disposed bucket", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 60 });
			bucket.dispose();
			await expect(bucket.acquire()).rejects.toThrow(/disposed/);
		});
	});

	describe("setRate", () => {
		it("speeds up draining when rate is increased while waiters are queued", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 }); // 1/sec
			expect(bucket.tryAcquire()).toBe(true); // drain

			let resolved = false;
			const p = bucket.acquire().then(() => {
				resolved = true;
			});

			// Advance only 200ms at the slow rate — would take ~1000ms
			await vi.advanceTimersByTimeAsync(200);
			expect(resolved).toBe(false);

			// Bump to 6000 rpm = 100/sec; queued waiter should now drain quickly
			bucket.setRate(6000);
			await vi.advanceTimersByTimeAsync(50);
			await p;
			expect(resolved).toBe(true);
		});

		it("rejects rates <= 0", () => {
			const bucket = new TokenBucket({ ratePerMinute: 60 });
			expect(() => bucket.setRate(0)).toThrow();
			expect(() => bucket.setRate(-1)).toThrow();
		});

		it("clamps tokens when capacity is reduced", () => {
			const bucket = new TokenBucket({ ratePerMinute: 600, capacity: 10 });
			// Have ~10 tokens
			bucket.setRate(600, 3);
			// Tokens should now be at most 3
			expect(bucket.availableTokens).toBeLessThanOrEqual(3);
		});
	});

	describe("dispose", () => {
		it("resolves outstanding waiters so callers do not hang", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 });
			expect(bucket.tryAcquire()).toBe(true);
			const p1 = bucket.acquire();
			const p2 = bucket.acquire();
			bucket.dispose();
			await Promise.all([p1, p2]);
		});

		it("is idempotent", () => {
			const bucket = new TokenBucket({ ratePerMinute: 60 });
			bucket.dispose();
			expect(() => bucket.dispose()).not.toThrow();
		});

		it("clears the wakeup timer (no leak)", async () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 1 });
			expect(bucket.tryAcquire()).toBe(true);
			void bucket.acquire(); // schedules a wakeup timer
			bucket.dispose();
			// After dispose, advancing time should not trigger any callback;
			// vitest's fake-timer queue should be empty.
			expect(vi.getTimerCount()).toBe(0);
		});
	});

	describe("constructor validation", () => {
		it("rejects ratePerMinute <= 0", () => {
			expect(() => new TokenBucket({ ratePerMinute: 0 })).toThrow();
			expect(() => new TokenBucket({ ratePerMinute: -1 })).toThrow();
		});

		it("coerces capacity below 1 up to 1", () => {
			const bucket = new TokenBucket({ ratePerMinute: 60, capacity: 0 });
			expect(bucket.tryAcquire()).toBe(true);
		});
	});
});
