/**
 * Message pointer - the envelope containing routing info
 * Matches the Java MessagePointer class structure
 */
/**
 * Dispatch mode — controls how messages within a group are processed.
 * IMMEDIATE: no ordering dependency, messages can be processed concurrently.
 * BLOCK_ON_ERROR / NEXT_ON_ERROR: strict FIFO within the group.
 */
export type DispatchMode = "IMMEDIATE" | "NEXT_ON_ERROR" | "BLOCK_ON_ERROR";

export type MessagePointer = {
	/** Unique message ID from the application */
	messageId: string;
	/** Pool code for routing */
	poolCode: string;
	/** Message group ID for FIFO ordering within a group */
	messageGroupId: string;
	/** The actual message payload (opaque to router) */
	payload?: unknown;
	/** Optional auth token for downstream calls */
	authToken?: string | undefined;
	/**
	 * Optional shared secret for HMAC-SHA256 webhook signing. When
	 * present, the mediator computes `HMAC(secret, timestamp + body)` and
	 * sends the result as `X-FLOWCATALYST-SIGNATURE` alongside
	 * `X-FLOWCATALYST-TIMESTAMP`. Receivers verify by reconstructing the
	 * same signature payload.
	 */
	signingSecret?: string | undefined;
	/** Optional callback URL override */
	callbackUrl?: string | undefined;
	/** Timestamp when message was created */
	createdAt?: string | undefined;
	/** Whether this is a high priority message (processed before regular messages in same group) */
	highPriority?: boolean | undefined;
	/** Dispatch mode — IMMEDIATE allows concurrent processing within a group */
	dispatchMode?: DispatchMode | undefined;
};

/**
 * Internal message representation with queue-specific metadata
 */
export interface QueueMessage {
	/** Queue-specific message ID (e.g., SQS MessageId) */
	brokerMessageId: string;
	/** Application message ID from payload */
	messageId: string;
	/** Receipt handle for ack/nack operations */
	receiptHandle: string;
	/** Parsed message pointer */
	pointer: MessagePointer;
	/** Approximate receive count */
	receiveCount: number;
	/** When the message was received by the consumer */
	receivedAt: Date;
	/** Batch ID for tracking batch+group FIFO */
	batchId: string;
	/** Queue identifier */
	queueId: string;
}

/**
 * Batch of messages from a single poll operation
 */
export interface MessageBatch {
	/** Unique batch ID */
	batchId: string;
	/** Messages in this batch */
	messages: QueueMessage[];
	/** Source queue identifier */
	queueId: string;
	/** When the batch was received */
	receivedAt: Date;
}

/**
 * Processing outcome - matches Java MediationResult
 */
export const ProcessingOutcome = {
	/** Message processed successfully - ACK */
	SUCCESS: "SUCCESS",
	/** Configuration error (4xx) - ACK to prevent infinite retry */
	ERROR_CONFIG: "ERROR_CONFIG",
	/** Processing error (5xx, timeout) - NACK for retry */
	ERROR_PROCESS: "ERROR_PROCESS",
	/** Connection error - NACK for retry */
	ERROR_CONNECTION: "ERROR_CONNECTION",
	/** Message deferred (ack=false response) - NACK with visibility */
	DEFERRED: "DEFERRED",
	/** Batch+group already failed - NACK without processing */
	BATCH_FAILED: "BATCH_FAILED",
	/**
	 * Destination throttled the request (HTTP 429). NACK with `Retry-After`
	 * delay, but do NOT count toward circuit-breaker failures or attempt
	 * budget, and do NOT mark the batch+group as failed — the destination is
	 * healthy, just throttling us.
	 */
	RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ProcessingOutcome =
	(typeof ProcessingOutcome)[keyof typeof ProcessingOutcome];

/**
 * Result of processing a message
 */
export interface ProcessingResult {
	outcome: ProcessingOutcome;
	/** Error message if failed */
	error?: string;
	/** HTTP status code from downstream */
	statusCode?: number;
	/** Processing duration in milliseconds */
	durationMs: number;
	/** Optional delay before retry (seconds) */
	delaySeconds?: number;
}
