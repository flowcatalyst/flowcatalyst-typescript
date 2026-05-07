/**
 * Events Schema
 *
 * Database schema for domain events (CloudEvents-based).
 * Events are immutable records of state changes in the system.
 */

import {
	pgTable,
	varchar,
	jsonb,
	index,
	uniqueIndex,
	primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tsidColumn, rawTsidColumn, timestampColumn } from "./common.js";

/**
 * Context data stored with events for filtering and search.
 */
export interface EventContextData {
	readonly key: string;
	readonly value: string;
}

/**
 * Events table schema (CloudEvents-based).
 */
export const events = pgTable(
	"msg_events",
	{
		// Primary key part 1 — unprefixed TSID for high-volume performance.
		// Combined with createdAt, the PK is composite to support range
		// partitioning by created_at in production.
		id: rawTsidColumn("id").notNull(),

		// CloudEvents required fields
		specVersion: varchar("spec_version", { length: 20 })
			.notNull()
			.default("1.0"),
		type: varchar("type", { length: 200 }).notNull(),
		source: varchar("source", { length: 500 }).notNull(),
		subject: varchar("subject", { length: 500 }),
		time: timestampColumn("time").notNull(),

		// Event data as JSONB
		data: jsonb("data"),

		// Tracing fields
		correlationId: varchar("correlation_id", { length: 100 }),
		causationId: varchar("causation_id", { length: 100 }),

		// Idempotency and ordering
		deduplicationId: varchar("deduplication_id", { length: 200 }),
		messageGroup: varchar("message_group", { length: 200 }),

		// Multi-tenant scoping
		clientId: tsidColumn("client_id"),

		// Additional context for filtering
		contextData: jsonb("context_data").$type<EventContextData[]>(),

		// Primary-key part 2 — also the partition key. NOT NULL is required
		// because partitioned tables disallow NULL in the partition column.
		createdAt: timestampColumn("created_at").notNull().defaultNow(),

		// Stamped by the stream processor once the row has been projected into
		// msg_events_read. The Rust projector reads unprojected rows via
		// `WHERE projected_at IS NULL`; the TS projector ignores the column
		// and drives off msg_event_projection_feed instead. Kept nullable so
		// either projector can fill it without a schema change.
		projectedAt: timestampColumn("projected_at"),

		// Stamped by the fan-out poller once subscriptions have been matched
		// and dispatch jobs created. Drives the partial index that the poller
		// reads from.
		fannedOutAt: timestampColumn("fanned_out_at"),
	},
	(table) => [
		// Composite primary key — required when the table is partitioned by
		// created_at; harmless when it isn't.
		primaryKey({ columns: [table.id, table.createdAt] }),
		// Index for client-scoped queries
		index("idx_msg_events_client_id").on(table.clientId),
		// Index for chronological queries
		index("idx_msg_events_created_at").on(table.createdAt),
		// Partial index for the projector's poll path
		index("idx_msg_events_unprojected")
			.on(table.createdAt)
			.where(sql`projected_at IS NULL`),
		// Partial index for the fan-out poller
		index("idx_msg_events_unfanned")
			.on(table.createdAt)
			.where(sql`fanned_out_at IS NULL`),
		// Unique index for idempotency. Includes createdAt because partitioned
		// uniques must include the partition key. Two events with the same
		// deduplicationId in *different* months are not rejected by the DB —
		// app-level dedup compensates if needed.
		uniqueIndex("idx_msg_events_deduplication").on(
			table.deduplicationId,
			table.createdAt,
		),
	],
);

/**
 * Event entity type (select result).
 */
export type Event = typeof events.$inferSelect;

/**
 * New event type (insert input).
 */
export type NewEvent = typeof events.$inferInsert;
