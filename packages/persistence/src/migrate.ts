/**
 * Database Migration Runner
 *
 * Runs DrizzleORM migrations using a single non-pooled connection.
 * Uses our own migration tracking logic to work around drizzle-orm
 * beta.17 regression where getMigrationsToRun ignores the name column.
 */

import { readMigrationFiles } from "drizzle-orm/migrator";
import { createMigrationDatabase } from "./connection.js";

/**
 * Run database migrations from the specified folder.
 *
 * Uses a single non-pooled connection that is closed after migrations complete.
 *
 * @param databaseUrl - PostgreSQL connection URL
 * @param migrationsFolder - Path to the folder containing migration files
 */
export async function runMigrations(
	databaseUrl: string,
	migrationsFolder: string,
): Promise<void> {
	const database = createMigrationDatabase({ url: databaseUrl });
	const sql = database.client;

	try {
		// Ensure migration schema and table exist (v1 format with name column)
		await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
		await sql`
			CREATE TABLE IF NOT EXISTS drizzle."__drizzle_migrations" (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint,
				name text,
				applied_at timestamp with time zone DEFAULT now()
			)
		`;

		// Upgrade v0 table: add name/applied_at columns if missing, then
		// backfill names by matching local migration hashes to DB rows.
		await sql`ALTER TABLE drizzle."__drizzle_migrations" ADD COLUMN IF NOT EXISTS name text`;
		await sql`ALTER TABLE drizzle."__drizzle_migrations" ADD COLUMN IF NOT EXISTS applied_at timestamp with time zone DEFAULT now()`;

		// Read local migration files
		const localMigrations = readMigrationFiles({ migrationsFolder });

		// Backfill names for any v0 rows (have hash but no name)
		const unnamed = await sql`
			SELECT id, hash FROM drizzle."__drizzle_migrations"
			WHERE name IS NULL
			ORDER BY id ASC
		`;
		if (unnamed.length > 0) {
			const hashToName = new Map(
				localMigrations.map((m) => [m.hash, m.name]),
			);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await sql.begin(async (tx: any) => {
				for (const row of unnamed) {
					const name = hashToName.get(row["hash"] as string);
					if (name) {
						await tx`
							UPDATE drizzle."__drizzle_migrations"
							SET name = ${name}
							WHERE id = ${row["id"]}
						`;
					} else {
						// Orphan migration in DB with no local match — remove it
						await tx`
							DELETE FROM drizzle."__drizzle_migrations"
							WHERE id = ${row["id"]}
						`;
					}
				}
			});
		}

		// Get already-applied migration names from the database
		const dbRows = await sql`
			SELECT name FROM drizzle."__drizzle_migrations"
			WHERE name IS NOT NULL
			ORDER BY id ASC
		`;
		const appliedNames = new Set(dbRows.map((r) => r["name"] as string));

		// Determine which migrations need to run
		const toRun = localMigrations.filter(
			(m) => m.name && !appliedNames.has(m.name),
		);

		if (toRun.length === 0) return;

		// Run pending migrations in a transaction
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await sql.begin(async (tx: any) => {
			for (const migration of toRun) {
				for (const stmt of migration.sql) {
					if (stmt.trim()) await tx.unsafe(stmt);
				}
				await tx`
					INSERT INTO drizzle."__drizzle_migrations" (hash, created_at, name)
					VALUES (${migration.hash}, ${migration.folderMillis}, ${migration.name})
				`;
			}
		});
	} finally {
		await database.close();
	}
}
