/**
 * Token bucket rate limiter with monotonic-clock refill.
 *
 * Replaces rate-limiter-flexible's RateLimiterQueue for the per-pool rate
 * limit. RateLimiterQueue wraps a RateLimiterMemory and schedules a
 * setTimeout per blocked call; at high contention this becomes measurable
 * timer churn and GC pressure (one queue node + one timer per waiter).
 *
 * This implementation:
 *   - Uses process.hrtime.bigint() for monotonic refill (no wall-clock skew,
 *     immune to system clock adjustments).
 *   - One shared wakeup timer regardless of queued waiter count — N waiters
 *     means one setTimeout, not N.
 *   - Synchronous fast path: tryAcquire() returns boolean without allocating
 *     a Promise. acquire() only allocates a Promise when it actually has to
 *     wait.
 *   - In-place rate updates without rebuilding the bucket. Existing waiters
 *     keep their FIFO position.
 *
 * Defaults preserve the previous "evenly-spaced leaky bucket" behaviour:
 * capacity = 1 means each token must be earned before it is spent. Increase
 * capacity to allow burstiness up to that depth.
 */
export interface TokenBucketOptions {
	/** Sustained rate, tokens per minute. Must be > 0. */
	ratePerMinute: number;
	/** Burst depth. Defaults to 1 (no burst). */
	capacity?: number;
	/**
	 * Maximum waiters queued. acquire() throws QueueFullError when exceeded.
	 * Defaults to Infinity (unbounded queue).
	 */
	maxQueueSize?: number;
}

export class QueueFullError extends Error {
	constructor() {
		super("TokenBucket queue is full");
		this.name = "QueueFullError";
	}
}

export class TokenBucket {
	private tokens: number;
	private lastRefillNs: bigint;
	private capacity: number;
	/** Tokens added per nanosecond of elapsed time. */
	private refillPerNs: number;
	private readonly maxQueueSize: number;
	private readonly waiters: Array<() => void> = [];
	private wakeupTimer: ReturnType<typeof setTimeout> | null = null;
	private disposed = false;

	constructor(opts: TokenBucketOptions) {
		if (opts.ratePerMinute <= 0) {
			throw new Error("ratePerMinute must be > 0");
		}
		this.capacity = Math.max(1, opts.capacity ?? 1);
		this.refillPerNs = opts.ratePerMinute / 60 / 1_000_000_000;
		this.tokens = this.capacity;
		this.lastRefillNs = process.hrtime.bigint();
		this.maxQueueSize = opts.maxQueueSize ?? Number.POSITIVE_INFINITY;
	}

	/**
	 * Synchronous attempt to take one token. Returns true on success.
	 * Use this for opportunistic checks; prefer acquire() for the normal
	 * path where you intend to wait if necessary.
	 */
	tryAcquire(): boolean {
		if (this.disposed) return false;
		this.refill();
		if (this.tokens >= 1) {
			this.tokens -= 1;
			return true;
		}
		return false;
	}

	/**
	 * Acquire one token, waiting if necessary.
	 * Throws QueueFullError if the wait queue is at maxQueueSize.
	 * Throws if the bucket has been disposed.
	 */
	async acquire(): Promise<void> {
		if (this.disposed) throw new Error("TokenBucket disposed");
		if (this.tryAcquire()) return;
		if (this.waiters.length >= this.maxQueueSize) {
			throw new QueueFullError();
		}
		return new Promise<void>((resolve) => {
			this.waiters.push(resolve);
			this.scheduleWakeup();
		});
	}

	/**
	 * Update rate (and optionally capacity) in place. Existing waiters keep
	 * their FIFO position; the wakeup timer is recomputed against the new
	 * rate.
	 */
	setRate(ratePerMinute: number, capacity?: number): void {
		if (ratePerMinute <= 0) throw new Error("ratePerMinute must be > 0");
		this.refill();
		this.refillPerNs = ratePerMinute / 60 / 1_000_000_000;
		if (capacity != null) {
			this.capacity = Math.max(1, capacity);
			if (this.tokens > this.capacity) this.tokens = this.capacity;
		}
		if (this.wakeupTimer !== null) {
			clearTimeout(this.wakeupTimer);
			this.wakeupTimer = null;
		}
		if (this.waiters.length > 0) this.scheduleWakeup();
	}

	/** Number of waiters currently queued. */
	get queueDepth(): number {
		return this.waiters.length;
	}

	/** Approximate token count, refilled to current time. */
	get availableTokens(): number {
		this.refill();
		return this.tokens;
	}

	/**
	 * Cancel pending timer and resolve any queued waiters. Subsequent
	 * acquire() calls reject. Idempotent.
	 */
	dispose(): void {
		if (this.disposed) return;
		this.disposed = true;
		if (this.wakeupTimer !== null) {
			clearTimeout(this.wakeupTimer);
			this.wakeupTimer = null;
		}
		while (this.waiters.length > 0) {
			const resolve = this.waiters.shift();
			if (resolve) resolve();
		}
	}

	private refill(): void {
		const now = process.hrtime.bigint();
		const elapsedNs = Number(now - this.lastRefillNs);
		if (elapsedNs <= 0) return;
		const refilled = elapsedNs * this.refillPerNs;
		this.tokens = Math.min(this.capacity, this.tokens + refilled);
		this.lastRefillNs = now;
	}

	private scheduleWakeup(): void {
		if (this.wakeupTimer !== null || this.disposed) return;
		this.refill();
		if (this.tokens >= 1) {
			// A token is already available — drain on the next microtask so
			// the resolver runs after the current synchronous call returns.
			queueMicrotask(() => this.drain());
			return;
		}
		const tokensNeeded = 1 - this.tokens;
		const waitMs = Math.max(
			1,
			Math.ceil(tokensNeeded / this.refillPerNs / 1_000_000),
		);
		this.wakeupTimer = setTimeout(() => {
			this.wakeupTimer = null;
			this.drain();
		}, waitMs);
	}

	private drain(): void {
		if (this.disposed) return;
		this.refill();
		while (this.waiters.length > 0 && this.tokens >= 1) {
			this.tokens -= 1;
			const resolve = this.waiters.shift();
			if (resolve) resolve();
		}
		if (this.waiters.length > 0) this.scheduleWakeup();
	}
}
