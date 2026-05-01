import type { ProcessingResult, QueueMessage } from "@flowcatalyst/contracts";
import type { HttpMediator } from "../../mediation/http-mediator.js";

/**
 * Test double for HttpMediator. Lets each test queue per-call outcomes,
 * inject latency, and inspect the messages that arrived at the mediator.
 *
 * Cast to HttpMediator in tests — we deliberately don't extend the class
 * (which has undici internals) since ProcessPool only ever calls process().
 */
export class MockMediator {
	/** Default outcome for messages with no explicit override. */
	defaultOutcome: ProcessingResult = {
		outcome: "SUCCESS",
		durationMs: 1,
	};

	/** Optional latency injected before returning a result. */
	latencyMs = 0;

	/** Per-message-id outcome overrides. */
	private readonly perMessage = new Map<string, ProcessingResult>();

	/** Per-message-id one-shot rejections (process() throws). */
	private readonly perMessageThrow = new Map<string, Error>();

	/** Every message that has been processed, in order of process() entry. */
	readonly processed: QueueMessage[] = [];

	/** Counter of currently-in-flight process() calls. */
	private inFlight = 0;
	private peakInFlight = 0;

	/** Queue an outcome that will be returned the next time the given message id is processed. */
	queueOutcome(messageId: string, result: ProcessingResult): void {
		this.perMessage.set(messageId, result);
	}

	/** Make process() throw for a specific message id (one-shot). */
	queueThrow(messageId: string, error: Error): void {
		this.perMessageThrow.set(messageId, error);
	}

	/** Highest concurrent in-flight count observed. */
	get peakConcurrency(): number {
		return this.peakInFlight;
	}

	async process(message: QueueMessage): Promise<ProcessingResult> {
		this.processed.push(message);
		this.inFlight++;
		if (this.inFlight > this.peakInFlight) this.peakInFlight = this.inFlight;
		try {
			if (this.latencyMs > 0) {
				await new Promise((r) => setTimeout(r, this.latencyMs));
			}
			const thrown = this.perMessageThrow.get(message.messageId);
			if (thrown) {
				this.perMessageThrow.delete(message.messageId);
				throw thrown;
			}
			const override = this.perMessage.get(message.messageId);
			if (override) {
				this.perMessage.delete(message.messageId);
				return override;
			}
			return this.defaultOutcome;
		} finally {
			this.inFlight--;
		}
	}

	/** Cast helper — ProcessPool only uses process(). */
	asMediator(): HttpMediator {
		return this as unknown as HttpMediator;
	}
}
