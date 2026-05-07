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
 * Optional configuration for runMigrations.
 */
export interface MigrationOptions {
	/**
	 * Optional second folder of Drizzle-shaped migrations applied AFTER the
	 * main folder. Use this for production-only schema work that the embedded
	 * dev DB should skip (e.g. declarative partitioning, which PGlite doesn't
	 * support). Tracked in the same `drizzle.__drizzle_migrations` table by
	 * name, so it's idempotent on rerun and won't conflict with the main
	 * folder's migrations as long as names are unique.
	 */
	productionMigrationsFolder?: string | undefined;
}

/**
 * Run database migrations from the specified folder.
 *
 * Uses a single non-pooled connection that is closed after migrations complete.
 *
 * @param databaseUrl - PostgreSQL connection URL
 * @param migrationsFolder - Path to the folder containing migration files
 * @param options - Optional config (e.g. an additional production-only folder)
 */
export async function runMigrations(
	databaseUrl: string,
	migrationsFolder: string,
	options: MigrationOptions = {},
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

		const mainMigrations = readMigrationFiles({ migrationsFolder });

		// Backfill names for any v0 rows (have hash but no name)
		const unnamed = await sql`
			SELECT id, hash FROM drizzle."__drizzle_migrations"
			WHERE name IS NULL
			ORDER BY id ASC
		`;
		if (unnamed.length > 0) {
			const hashToName = new Map(mainMigrations.map((m) => [m.hash, m.name]));
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

		await applyMigrationFolder(sql, mainMigrations);

		if (options.productionMigrationsFolder) {
			const productionMigrations = readMigrationFiles({
				migrationsFolder: options.productionMigrationsFolder,
			});
			await applyMigrationFolder(sql, productionMigrations);
		}
	} finally {
		await database.close();
	}
}

/**
 * Apply pending migrations from a parsed folder. Migrations not yet recorded
 * in `drizzle.__drizzle_migrations` (by name) are run inside a single
 * transaction; their names are then inserted as a record of completion.
 */
async function applyMigrationFolder(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sql: any,
	migrations: ReturnType<typeof readMigrationFiles>,
): Promise<void> {
	const dbRows = await sql`
		SELECT name FROM drizzle."__drizzle_migrations"
		WHERE name IS NOT NULL
		ORDER BY id ASC
	`;
	const appliedNames = new Set(dbRows.map((r: { name: string }) => r.name));

	const toRun = migrations.filter(
		(m) => m.name && !appliedNames.has(m.name),
	);

	if (toRun.length === 0) return;

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
}
