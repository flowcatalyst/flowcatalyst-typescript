import { describe, it, expect, vi } from "vitest";
import type { Logger } from "@flowcatalyst/logging";
import type { QueueMessage } from "@flowcatalyst/contracts";
import { InFlightTracker } from "../services/queue-manager/in-flight-tracker.js";
import { WarningService } from "../services/warning-service.js";

function makeLogger(): Logger {
	return {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		debug: vi.fn(),
		fatal: vi.fn(),
		trace: vi.fn(),
		child: () => makeLogger(),
	} as unknown as Logger;
}

function makeTracker() {
	const logger = makeLogger();
	const warnings = new WarningService(logger);
	const tracker = new InFlightTracker({
		warnings,
		logger,
		totalPoolCapacity: () => 100,
		isRunning: () => true,
	});
	return { tracker, warnings, logger };
}

function makeMessage(id: string, brokerId: string): QueueMessage {
	return {
		messageId: id,
		brokerMessageId: brokerId,
		pointer: {
			messageId: id,
			poolCode: "DEFAULT-POOL",
			mediationType: "HTTP",
			mediationTarget: "https://example.test/wh",
			authToken: undefined,
		},
	} as unknown as QueueMessage;
}

describe("InFlightTracker.reapStale", () => {
	it("returns 0 when nothing is tracked", () => {
		const { tracker } = makeTracker();
		expect(tracker.reapStale(60_000)).toBe(0);
	});

	it("returns 0 when entries are within maxAgeMs", () => {
		const { tracker } = makeTracker();
		tracker.dedupeAndTrack(makeMessage("m1", "b1"), undefined, "queue-a");
		expect(tracker.reapStale(60_000)).toBe(0);
		expect(tracker.size()).toBe(1);
	});

	it("removes entries older than maxAgeMs from all three maps", async () => {
		const { tracker } = makeTracker();
		tracker.dedupeAndTrack(makeMessage("m1", "b1"), undefined, "queue-a");
		tracker.dedupeAndTrack(makeMessage("m2", "b2"), undefined, "queue-a");
		expect(tracker.size()).toBe(2);

		// Use a maxAgeMs of 0 so any entry counts as stale, then await a
		// macrotask to ensure addedAt < Date.now().
		await new Promise((r) => setTimeout(r, 2));

		expect(tracker.reapStale(1)).toBe(2);
		expect(tracker.size()).toBe(0);
		// Both indices must be cleared — a re-add of the same broker id
		// should be tracked, not detected as physical_redelivery.
		const res = tracker.dedupeAndTrack(
			makeMessage("m1", "b1"),
			undefined,
			"queue-a",
		);
		expect(res.kind).toBe("tracked");
	});

	it("leaves fresh entries alone", async () => {
		const { tracker } = makeTracker();
		tracker.dedupeAndTrack(makeMessage("old", "b-old"), undefined, "q");
		await new Promise((r) => setTimeout(r, 5));
		tracker.dedupeAndTrack(makeMessage("new", "b-new"), undefined, "q");

		// Reap entries older than 3ms — only "old" qualifies.
		const reaped = tracker.reapStale(3);
		expect(reaped).toBe(1);
		expect(tracker.size()).toBe(1);
		expect(tracker.isPipelineKeyInFlight("b-new")).toBe(true);
		expect(tracker.isPipelineKeyInFlight("b-old")).toBe(false);
	});

	it("emits a warning when entries are reaped", async () => {
		const { tracker, warnings } = makeTracker();
		tracker.dedupeAndTrack(makeMessage("m1", "b1"), undefined, "q");
		await new Promise((r) => setTimeout(r, 2));
		tracker.reapStale(1);

		const all = warnings.getAll();
		const reaperWarnings = all.filter((w) =>
			w.message.includes("Reaped"),
		);
		expect(reaperWarnings).toHaveLength(1);
		expect(reaperWarnings[0]?.category).toBe("PIPELINE_MAP_LEAK");
	});
});
