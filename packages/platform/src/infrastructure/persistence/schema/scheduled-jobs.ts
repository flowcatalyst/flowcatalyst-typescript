/**
 * Scheduled Jobs Database Schema
 *
 * `msg_scheduled_jobs` — definition aggregate (regular table, low volume).
 *
 * The instance and instance-log tables (`msg_scheduled_job_instances`,
 * `msg_scheduled_job_instance_logs`) are NOT modelled here as Drizzle
 * schemas: they are high-volume, partitioned tables written via raw SQL
 * by the infrastructure path (poller + dispatcher + SDK callbacks), and
 * deliberately bypass the UnitOfWork.
 */

import {
	pgTable,
	varchar,
	text,
	boolean,
	integer,
	jsonb,
	uniqueIndex,
	index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestampColumn } from "@flowcatalyst/persistence";

export const scheduledJobs = pgTable(
	"msg_scheduled_jobs",
	{
		id: varchar("id", { length: 17 }).primaryKey(),
		clientId: varchar("client_id", { length: 17 }),
		code: varchar("code", { length: 200 }).notNull(),
		name: varchar("name", { length: 200 }).notNull(),
		description: text("description"),
		status: varchar("status", { length: 20 }).notNull().default("ACTIVE"),
		/** Array of cron expressions — unioned at evaluation. */
		crons: text("crons").array().notNull(),
		timezone: varchar("timezone", { length: 64 }).notNull().default("UTC"),
		payload: jsonb("payload"),
		concurrent: boolean("concurrent").notNull().default(false),
		tracksCompletion: boolean("tracks_completion").notNull().default(false),
		timeoutSeconds: integer("timeout_seconds"),
		deliveryMaxAttempts: integer("delivery_max_attempts").notNull().default(3),
		targetUrl: varchar("target_url", { length: 500 }),
		lastFiredAt: timestampColumn("last_fired_at"),
		createdAt: timestampColumn("created_at").notNull().defaultNow(),
		updatedAt: timestampColumn("updated_at").notNull().defaultNow(),
		createdBy: varchar("created_by", { length: 17 }),
		updatedBy: varchar("updated_by", { length: 17 }),
		version: integer("version").notNull().default(1),
	},
	(table) => [
		uniqueIndex("idx_msg_scheduled_jobs_code_per_client")
			.on(table.clientId, table.code)
			.where(sql`${table.clientId} IS NOT NULL`),
		uniqueIndex("idx_msg_scheduled_jobs_code_platform")
			.on(table.code)
			.where(sql`${table.clientId} IS NULL`),
		index("idx_msg_scheduled_jobs_client_id").on(table.clientId),
		index("idx_msg_scheduled_jobs_active_poll")
			.on(table.lastFiredAt)
			.where(sql`${table.status} = 'ACTIVE'`),
	],
);

export type ScheduledJobRecord = typeof scheduledJobs.$inferSelect;
export type NewScheduledJobRecord = typeof scheduledJobs.$inferInsert;
