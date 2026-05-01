import type { MessageCallback } from "../../pool/process-pool.js";

/**
 * Captures ack()/nack() calls made by ProcessPool. Resolves the
 * `settled` promise as soon as either is invoked, so tests can
 * await the outcome without arbitrary sleeps.
 */
export class MockCallback implements MessageCallback {
	ackCount = 0;
	nackCount = 0;
	lastNackDelay: number | undefined;

	private resolveSettled!: (outcome: "ack" | "nack") => void;
	readonly settled: Promise<"ack" | "nack">;

	constructor() {
		this.settled = new Promise<"ack" | "nack">((resolve) => {
			this.resolveSettled = resolve;
		});
	}

	get isAcked(): boolean {
		return this.ackCount > 0;
	}

	get isNacked(): boolean {
		return this.nackCount > 0;
	}

	async ack(): Promise<void> {
		this.ackCount++;
		this.resolveSettled("ack");
	}

	async nack(visibilityTimeoutSeconds?: number): Promise<void> {
		this.nackCount++;
		this.lastNackDelay = visibilityTimeoutSeconds;
		this.resolveSettled("nack");
	}
}
