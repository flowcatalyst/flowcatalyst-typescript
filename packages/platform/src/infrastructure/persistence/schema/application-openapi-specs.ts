/**
 * Application OpenAPI Specs Database Schema
 *
 * Per-application OpenAPI document storage with versioning. At most one row
 * per application has status='CURRENT' (enforced by a partial unique index);
 * previous syncs are flipped to status='ARCHIVED' with computed change_notes
 * so the lineage is auditable. The platform itself is one of the applications
 * (seeded row with code='platform') so its spec is stored the same way.
 *
 * Mirrors flowcatalyst-rust migration 025.
 */

import {
	pgTable,
	varchar,
	text,
	jsonb,
	index,
	uniqueIndex,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { baseEntityColumns, tsidColumn } from "@flowcatalyst/persistence";

export const applicationOpenapiSpecs = pgTable(
	"app_application_openapi_specs",
	{
		...baseEntityColumns,
		applicationId: tsidColumn("application_id").notNull(),
		version: varchar("version", { length: 64 }).notNull(),
		status: varchar("status", { length: 20 }).notNull(),
		spec: jsonb("spec").notNull(),
		specHash: varchar("spec_hash", { length: 64 }).notNull(),
		changeNotes: jsonb("change_notes"),
		changeNotesText: text("change_notes_text"),
		syncedAt: timestamp("synced_at", { withTimezone: true, mode: "date" })
			.notNull()
			.defaultNow(),
		syncedBy: tsidColumn("synced_by"),
	},
	(table) => [
		unique("app_application_openapi_specs_application_id_version_unique").on(
			table.applicationId,
			table.version,
		),
		uniqueIndex("idx_app_openapi_one_current")
			.on(table.applicationId)
			.where(sql`status = 'CURRENT'`),
		index("idx_app_openapi_app").on(table.applicationId, table.syncedAt.desc()),
	],
);

export type ApplicationOpenapiSpecRecord =
	typeof applicationOpenapiSpecs.$inferSelect;
export type NewApplicationOpenapiSpecRecord =
	typeof applicationOpenapiSpecs.$inferInsert;
