import type { Logger } from "@flowcatalyst/logging";

/**
 * Tick callbacks the scheduler invokes on its six timers. Each
 * fires synchronously from the timer; async work happens inside the
 * callback at the manager's discretion.
 */
export interface BackgroundTaskCallbacks {
	/** Every 10s — sweep drained pools and stopped consumers. */
	onCleanupTick: () => void;
	/** Every 60s — restart any unhealthy consumers. */
	onHealthCheck: () => void;
	/** Every 30s — leak-detect the in-flight tracker. */
	onLeakCheck: () => void;
	/** Every 60s — reap stale in-flight entries (defence-in-depth). */
	onStuckReap: () => void;
	/** Every 5 minutes — reset 5-minute window stats. */
	onWindowReset5min: () => void;
	/** Every 30 minutes — reset 30-minute window stats. */
	onWindowReset30min: () => void;
}

const CLEANUP_INTERVAL_MS = 10_000;
const HEALTH_CHECK_INTERVAL_MS = 60_000;
const LEAK_CHECK_INTERVAL_MS = 30_000;
const STUCK_REAP_INTERVAL_MS = 60_000;
const WINDOW_RESET_5MIN_MS = 5 * 60 * 1000;
const WINDOW_RESET_30MIN_MS = 30 * 60 * 1000;

/**
 * Owns the five background timers the queue manager runs. Each timer
 * is `setInterval`-based; the scheduler holds the handles so the manager
 * doesn't need five `setInterval | null` fields and the matching
 * `clearInterval` calls.
 */
export class BackgroundTaskScheduler {
	private cleanup: ReturnType<typeof setInterval> | null = null;
	private health: ReturnType<typeof setInterval> | null = null;
	private leak: ReturnType<typeof setInterval> | null = null;
	private stuckReap: ReturnType<typeof setInterval> | null = null;
	private windowReset5min: ReturnType<typeof setInterval> | null = null;
	private windowReset30min: ReturnType<typeof setInterval> | null = null;

	private readonly logger: Logger;
	constructor(logger: Logger) {
		this.logger = logger;
	}

	/**
	 * Start all five timers. Calling this twice without `stop` first
	 * will leak the previous handles — the manager only calls it once
	 * at startup so the constraint isn't enforced here.
	 */
	start(callbacks: BackgroundTaskCallbacks): void {
		this.cleanup = setInterval(callbacks.onCleanupTick, CLEANUP_INTERVAL_MS);
		this.logger.debug("Cleanup task started (10s interval)");

		this.health = setInterval(callbacks.onHealthCheck, HEALTH_CHECK_INTERVAL_MS);
		this.logger.debug("Consumer health monitor started (60s interval)");

		this.leak = setInterval(callbacks.onLeakCheck, LEAK_CHECK_INTERVAL_MS);
		this.logger.debug("Leak detection started (30s interval)");

		this.stuckReap = setInterval(callbacks.onStuckReap, STUCK_REAP_INTERVAL_MS);
		this.logger.debug("Stuck-message reaper started (60s interval)");

		this.windowReset5min = setInterval(
			callbacks.onWindowReset5min,
			WINDOW_RESET_5MIN_MS,
		);
		this.windowReset30min = setInterval(
			callbacks.onWindowReset30min,
			WINDOW_RESET_30MIN_MS,
		);
		this.logger.debug("Queue stat window resets started (5min/30min)");
	}

	/** Clear every interval. Idempotent. */
	stop(): void {
		if (this.cleanup) {
			clearInterval(this.cleanup);
			this.cleanup = null;
		}
		if (this.health) {
			clearInterval(this.health);
			this.health = null;
		}
		if (this.leak) {
			clearInterval(this.leak);
			this.leak = null;
		}
		if (this.stuckReap) {
			clearInterval(this.stuckReap);
			this.stuckReap = null;
		}
		if (this.windowReset5min) {
			clearInterval(this.windowReset5min);
			this.windowReset5min = null;
		}
		if (this.windowReset30min) {
			clearInterval(this.windowReset30min);
			this.windowReset30min = null;
		}
	}
}
