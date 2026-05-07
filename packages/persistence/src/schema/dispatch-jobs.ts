/**
 * Dispatch Jobs Schema
 *
 * Database schema for dispatch jobs - webhook/event delivery tasks.
 * Dispatch jobs are created when events match subscriptions or via direct API.
 */

import {
	pgTable,
	varchar,
	text,
	integer,
	bigint,
	boolean,
	jsonb,
	index,
	primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tsidColumn, rawTsidColumn, timestampColumn } from "./common.js";

/**
 * Dispatch job kind - EVENT (from subscription) or TASK (direct API).
 */
export type DispatchKind = "EVENT" | "TASK";

/**
 * Dispatch protocol for delivery.
 */
export type DispatchProtocol = "HTTP_WEBHOOK" | "SQS" | "SNS";

/**
 * Dispatch status lifecycle.
 */
export type DispatchStatus =
	| "PENDING"
	| "QUEUED"
	| "PROCESSING"
	| "COMPLETED"
	| "FAILED"
	| "CANCELLED"
	| "EXPIRED";

/**
 * Dispatch mode for ordering/blocking behavior.
 */
export type DispatchMode = "IMMEDIATE" | "NEXT_ON_ERROR" | "BLOCK_ON_ERROR";

/**
 * Metadata key-value pair stored with dispatch jobs.
 */
export interface DispatchJobMetadata {
	readonly key: string;
	readonly value: string;
}

/**
 * Dispatch jobs table schema.
 */
export const dispatchJobs = pgTable(
	"msg_dispatch_jobs",
	{
		// Primary key part 1 — unprefixed TSID for high-volume performance.
		// Combined with createdAt, the PK is composite to support range
		// partitioning by created_at in production.
		id: rawTsidColumn("id").notNull(),

		// External reference ID (for client tracking)
		externalId: varchar("external_id", { length: 100 }),

		// Classification
		source: varchar("source", { length: 500 }),
		kind: varchar("kind", { length: 20 })
			.notNull()
			.default("EVENT")
			.$type<DispatchKind>(),
		code: varchar("code", { length: 200 }).notNull(),
		subject: varchar("subject", { length: 500 }),

		// Event reference (unprefixed - events also use raw TSIDs)
		eventId: rawTsidColumn("event_id"),
		correlationId: varchar("correlation_id", { length: 100 }),

		// Metadata (key-value pairs as JSON array)
		metadata: jsonb("metadata").$type<DispatchJobMetadata[]>().default([]),

		// Target configuration
		targetUrl: varchar("target_url", { length: 500 }).notNull(),
		protocol: varchar("protocol", { length: 30 })
			.notNull()
			.default("HTTP_WEBHOOK")
			.$type<DispatchProtocol>(),

		// Payload
		payload: text("payload"),
		payloadContentType: varchar("payload_content_type", {
			length: 100,
		}).default("application/json"),
		dataOnly: boolean("data_only").notNull().default(true),

		// Credentials reference
		serviceAccountId: tsidColumn("service_account_id"),

		// Multi-tenant context
		clientId: tsidColumn("client_id"),
		subscriptionId: tsidColumn("subscription_id"),
		connectionId: tsidColumn("connection_id"),

		// Dispatch behavior
		mode: varchar("mode", { length: 30 })
			.notNull()
			.default("IMMEDIATE")
			.$type<DispatchMode>(),
		dispatchPoolId: tsidColumn("dispatch_pool_id"),
		messageGroup: varchar("message_group", { length: 200 }),
		sequence: integer("sequence").notNull().default(99),
		timeoutSeconds: integer("timeout_seconds").notNull().default(30),

		// Schema reference
		schemaId: tsidColumn("schema_id"),

		// Execution control
		status: varchar("status", { length: 20 })
			.notNull()
			.default("PENDING")
			.$type<DispatchStatus>(),
		maxRetries: integer("max_retries").notNull().default(3),
		retryStrategy: varchar("retry_strategy", { length: 50 }).default(
			"exponential",
		),
		scheduledFor: timestampColumn("scheduled_for"),
		expiresAt: timestampColumn("expires_at"),

		// Tracking
		attemptCount: integer("attempt_count").notNull().default(0),
		lastAttemptAt: timestampColumn("last_attempt_at"),
		completedAt: timestampColumn("completed_at"),
		durationMillis: bigint("duration_millis", { mode: "number" }),
		lastError: text("last_error"),

		// Idempotency
		idempotencyKey: varchar("idempotency_key", { length: 100 }),

		// Timestamps
		createdAt: timestampColumn("created_at").notNull().defaultNow(),
		updatedAt: timestampColumn("updated_at").notNull().defaultNow(),

		// Stamped the moment the scheduler publishes the job onto the queue.
		// Used by the Rust scheduler's stale-queued recovery (resets rows
		// that have sat in QUEUED past the configured threshold).
		queuedAt: timestampColumn("queued_at"),

		// Stamped by the Rust projector when the row is pushed into
		// msg_dispatch_jobs_read. The TS projector ignores it and reads from
		// msg_dispatch_job_projection_feed instead. Additive — either
		// projector can fill the column without breaking the other.
		projectedAt: timestampColumn("projected_at"),
	},
	(table) => [
		// Composite primary key — required when the table is partitioned by
		// created_at; harmless when it isn't.
		primaryKey({ columns: [table.id, table.createdAt] }),
		// Transactional-path indexes only. Rich query indexes belong on the
		// read projection (msg_dispatch_jobs_read).
		index("idx_dispatch_jobs_pending_poll")
			.on(table.messageGroup, table.sequence, table.createdAt)
			.where(sql`status = 'PENDING'`),
		index("idx_dispatch_jobs_blocked_groups")
			.on(table.messageGroup, table.status)
			.where(sql`status IN ('FAILED', 'ERROR')`),
		index("idx_dispatch_jobs_stale_queued")
			.on(table.queuedAt)
			.where(sql`status = 'QUEUED'`),
		index("idx_msg_dispatch_jobs_unprojected")
			.on(table.createdAt)
			.where(sql`projected_at IS NULL`),
	],
);

/**
 * Dispatch job entity type (select result).
 */
export type DispatchJobRecord = typeof dispatchJobs.$inferSelect;

/**
 * New dispatch job type (insert input).
 */
export type NewDispatchJobRecord = typeof dispatchJobs.$inferInsert;
