/**
 * Embedded Postgres (PGlite) for zero-setup local dev.
 *
 * Boots PGlite (real Postgres compiled to WASM) in-process and exposes it
 * over TCP via @electric-sql/pglite-socket, so the app connects over a
 * normal `postgres://` URL and devs can `psql` the same port to inspect
 * records.
 *
 * Not for production — single-process, no replication, limited extensions.
 */

import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Logger } from "@flowcatalyst/logging";

export interface EmbeddedPostgresOptions {
	/** TCP port to expose the database on. */
	port: number;
	/** Host to bind on. Use "127.0.0.1" to block remote access. */
	host: string;
	/**
	 * Directory for persistent DB files. If undefined or "memory", PGlite
	 * runs in-memory and the DB is wiped on restart.
	 */
	dataDir?: string;
	logger: Logger;
}

export interface EmbeddedPostgresHandle {
	/** Connection string the app (and any psql client) can use. */
	url: string;
	stop: () => Promise<void>;
}

/**
 * Start an embedded Postgres instance and expose it over TCP.
 * Resolves once the socket server is accepting connections.
 */
export async function startEmbeddedPostgres(
	opts: EmbeddedPostgresOptions,
): Promise<EmbeddedPostgresHandle> {
	const { port, host, logger } = opts;

	// Dynamic imports keep @electric-sql/pglite out of the critical-path bundle
	// graph and match the tsup-externalized pattern used for other native deps.
	const { PGlite } = await import("@electric-sql/pglite");
	const { PGLiteSocketServer } = await import("@electric-sql/pglite-socket");

	const dataDir =
		opts.dataDir && opts.dataDir !== "memory"
			? resolve(opts.dataDir)
			: undefined;

	if (dataDir) {
		mkdirSync(dataDir, { recursive: true });
		logger.info({ dataDir }, "Starting embedded Postgres (persistent)");
	} else {
		logger.info("Starting embedded Postgres (in-memory)");
	}

	const db = await PGlite.create(dataDir);

	const server = new PGLiteSocketServer({
		db,
		port,
		host,
	});

	await server.start();

	const url = `postgres://postgres@${host}:${port}/postgres`;
	logger.info(
		{ url },
		"Embedded Postgres ready — connect with `psql` or any client using this URL",
	);

	return {
		url,
		async stop() {
			try {
				await server.stop();
			} catch (err) {
				logger.error({ err }, "Error stopping embedded Postgres socket server");
			}
			try {
				await db.close();
			} catch (err) {
				logger.error({ err }, "Error closing embedded Postgres instance");
			}
		},
	};
}
