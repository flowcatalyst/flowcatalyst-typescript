import type {
	DispatchMode,
	MessagePointer,
	QueueMessage,
} from "@flowcatalyst/contracts";

export interface MakeMessageOpts {
	messageId?: string;
	brokerMessageId?: string;
	poolCode?: string;
	groupId?: string;
	dispatchMode?: DispatchMode;
	highPriority?: boolean;
	batchId?: string;
	queueId?: string;
	callbackUrl?: string;
	authToken?: string;
}

let counter = 0;

/**
 * Build a QueueMessage with sensible defaults. Override any field via opts.
 * Each call without an explicit messageId gets a unique auto-incremented id
 * so tests can submit batches without manual id management.
 */
export function makeMessage(opts: MakeMessageOpts = {}): QueueMessage {
	const id = opts.messageId ?? `msg-${++counter}`;
	const pointer: MessagePointer = {
		messageId: id,
		poolCode: opts.poolCode ?? "TEST-POOL",
		messageGroupId: opts.groupId ?? "default-group",
		dispatchMode: opts.dispatchMode ?? "BLOCK_ON_ERROR",
		highPriority: opts.highPriority ?? false,
		callbackUrl: opts.callbackUrl,
		authToken: opts.authToken,
	};
	return {
		brokerMessageId: opts.brokerMessageId ?? `broker-${id}`,
		messageId: id,
		receiptHandle: `rh-${id}`,
		pointer,
		receiveCount: 1,
		receivedAt: new Date(),
		batchId: opts.batchId ?? "test-batch",
		queueId: opts.queueId ?? "test-queue",
	};
}

/** Reset the auto-increment counter (use in beforeEach for deterministic ids). */
export function resetMessageCounter(): void {
	counter = 0;
}
