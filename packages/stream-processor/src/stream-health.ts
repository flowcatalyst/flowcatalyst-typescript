/**
 * Stream health tracking — per-service counters for liveness, throughput,
 * and error visibility. Mirrors `crates/fc-stream/src/health.rs`. The
 * stream processor currently runs in its own process with no HTTP
 * server; this module provides the data so a future endpoint (or the
 * caller embedding `startStreamProcessor`) can expose it.
 */

export type StreamStatus = "RUNNING" | "STOPPED" | "ERROR";

export interface StreamHealthSnapshot {
	name: string;
	status: StreamStatus;
	processedCount: number;
	errorCount: number;
	lastPollAtMs: number | null;
}

/**
 * Lightweight counter-based health tracker. Each projection or fan-out
 * service owns one and updates it on poll outcomes.
 */
export class StreamHealth {
	private readonly _name: string;
	private _running = false;
	private _processedCount = 0;
	private _errorCount = 0;
	private _lastPollAtMs = 0;

	constructor(name: string) {
		this._name = name;
	}

	get name(): string {
		return this._name;
	}

	isRunning(): boolean {
		return this._running;
	}

	setRunning(running: boolean): void {
		this._running = running;
	}

	addProcessed(count: number): void {
		this._processedCount += count;
		this._lastPollAtMs = Date.now();
	}

	recordError(): void {
		this._errorCount++;
	}

	snapshot(): StreamHealthSnapshot {
		return {
			name: this._name,
			status: this._running ? "RUNNING" : "STOPPED",
			processedCount: this._processedCount,
			errorCount: this._errorCount,
			lastPollAtMs: this._lastPollAtMs > 0 ? this._lastPollAtMs : null,
		};
	}
}

/**
 * Aggregated health across all stream-processor services. `healthy` is
 * true iff every service is `RUNNING` (matches Rust's
 * `AggregatedHealth::is_ready`).
 */
export interface StreamProcessorHealth {
	healthy: boolean;
	totalStreams: number;
	healthyStreams: number;
	unhealthyStreams: number;
	streams: StreamHealthSnapshot[];
}

export function aggregateHealth(
	streams: StreamHealth[],
): StreamProcessorHealth {
	const snapshots = streams.map((s) => s.snapshot());
	const healthy = snapshots.filter((s) => s.status === "RUNNING").length;
	return {
		healthy: healthy === snapshots.length && snapshots.length > 0,
		totalStreams: snapshots.length,
		healthyStreams: healthy,
		unhealthyStreams: snapshots.length - healthy,
		streams: snapshots,
	};
}
