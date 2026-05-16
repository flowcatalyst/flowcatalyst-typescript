/**
 * Processes Database Schema
 *
 * Process documentation — free-form Mermaid diagrams describing workflows
 * inside an application. Mirrors msg_event_types: code is application:subdomain:process,
 * platform-owned aggregate, status CURRENT/ARCHIVED, source CODE/API/UI.
 *
 * Mirrors flowcatalyst-rust migration 026.
 */

import { pgTable, varchar, text, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { baseEntityColumns } from "@flowcatalyst/persistence";

export const processes = pgTable(
	"msg_processes",
	{
		...baseEntityColumns,
		code: varchar("code", { length: 255 }).notNull().unique(),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description"),
		status: varchar("status", { length: 20 }).notNull().default("CURRENT"),
		source: varchar("source", { length: 20 }).notNull().default("UI"),
		application: varchar("application", { length: 100 }).notNull(),
		subdomain: varchar("subdomain", { length: 100 }).notNull(),
		processName: varchar("process_name", { length: 100 }).notNull(),
		body: text("body").notNull().default(""),
		diagramType: varchar("diagram_type", { length: 20 })
			.notNull()
			.default("mermaid"),
		tags: text("tags")
			.array()
			.notNull()
			.default(sql`ARRAY[]::TEXT[]`),
	},
	(table) => [
		index("idx_msg_processes_status").on(table.status),
		index("idx_msg_processes_source").on(table.source),
		index("idx_msg_processes_application").on(table.application),
		index("idx_msg_processes_subdomain").on(table.subdomain),
	],
);

export type ProcessRecord = typeof processes.$inferSelect;
export type NewProcessRecord = typeof processes.$inferInsert;
