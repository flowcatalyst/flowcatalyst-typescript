/**
 * Embedded Postgres for zero-setup local dev.
 *
 * Spawns the real PostgreSQL binary (bundled via `@embedded-postgres/<plat>`)
 * as a child process. Connect via a normal `postgres://` URL — `psql` works,
 * concurrent connections work, no special pooling required.
 *
 * In a Node SEA binary the postgres dist is packed via scripts/pack-postgres.js
 * and extracted to /tmp on first run; outside SEA we resolve from node_modules.
 *
 * Not for production — single-process, no replication. Intended for dev/demo.
 */

import { spawn } from "node:child_process";
import {
	mkdirSync,
	writeFileSync,
	existsSync,
	chmodSync,
	symlinkSync,
	rmSync,
} from "node:fs";
import { resolve, dirname, join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { zstdDecompressSync } from "node:zlib";
import type { Logger } from "@flowcatalyst/logging";

export interface EmbeddedPostgresOptions {
	port: number;
	host: string;
	/** Directory for cluster data. Defaults to `.fc-data/pg`. */
	dataDir?: string;
	logger: Logger;
}

export interface EmbeddedPostgresHandle {
	url: string;
	stop: () => Promise<void>;
}

export async function startEmbeddedPostgres(
	opts: EmbeddedPostgresOptions,
): Promise<EmbeddedPostgresHandle> {
	const { port, host, logger } = opts;
	const dataDir = resolve(opts.dataDir ?? ".fc-data/pg");

	const binDir = await resolvePostgresBinDir(logger);
	const initdb = join(binDir, "initdb");
	const postgres = join(binDir, "postgres");

	mkdirSync(dataDir, { recursive: true });

	// Run initdb only if the cluster hasn't been initialised yet (PG_VERSION
	// file is the canonical marker postgres itself looks for).
	if (!existsSync(join(dataDir, "PG_VERSION"))) {
		logger.info({ dataDir }, "Initialising embedded Postgres cluster");
		await runOnce(initdb, [
			"-D",
			dataDir,
			"-U",
			"postgres",
			"-A",
			"trust",
			"--encoding=UTF8",
			"--locale=C",
			"--no-instructions",
		]);
	} else {
		logger.info({ dataDir }, "Reusing embedded Postgres cluster");
	}

	// Listen on TCP only — disable the unix socket so it doesn't try to write
	// to /tmp at fixed paths that could collide across instances.
	const proc = spawn(
		postgres,
		[
			"-D",
			dataDir,
			"-p",
			String(port),
			"-h",
			host,
			"-c",
			"listen_addresses=" + host,
			"-c",
			"unix_socket_directories=",
			"-c",
			"log_min_messages=warning",
		],
		{ stdio: ["ignore", "pipe", "pipe"] },
	);

	proc.stdout?.on("data", (chunk: Buffer) => {
		const text = chunk.toString().trimEnd();
		if (text) logger.debug({ src: "postgres" }, text);
	});
	proc.stderr?.on("data", (chunk: Buffer) => {
		const text = chunk.toString().trimEnd();
		if (text) logger.debug({ src: "postgres" }, text);
	});
	proc.on("exit", (code, signal) => {
		if (code !== 0 && code !== null) {
			logger.error({ code, signal }, "Embedded Postgres exited unexpectedly");
		}
	});

	await waitForReady(host, port, 30_000);
	logger.info(
		{ url: `postgres://postgres@${host}:${port}/postgres`, dataDir, pid: proc.pid },
		"Embedded Postgres ready",
	);

	return {
		url: `postgres://postgres@${host}:${port}/postgres`,
		async stop() {
			if (proc.exitCode !== null) return;
			// SIGINT triggers Postgres "fast shutdown" — terminates active
			// queries, doesn't wait for clients. We follow up with SIGKILL after
			// 5s as a safety net.
			proc.kill("SIGINT");
			const killed = await new Promise<boolean>((res) => {
				const t = setTimeout(() => res(false), 5_000);
				proc.once("exit", () => {
					clearTimeout(t);
					res(true);
				});
			});
			if (!killed) {
				logger.warn("Embedded Postgres did not exit cleanly; sending SIGKILL");
				proc.kill("SIGKILL");
			}
		},
	};
}

/**
 * Resolve the directory containing `postgres`, `initdb`, `pg_ctl` for the
 * current platform. In a SEA we extract the packed binary asset to /tmp on
 * first call (then symlink-hydrate); outside SEA we resolve through
 * `@embedded-postgres/<platform>` in node_modules.
 */
async function resolvePostgresBinDir(logger: Logger): Promise<string> {
	const cjsRequire: NodeJS.Require | null =
		typeof require !== "undefined" ? require : null;

	const sea = (() => {
		try {
			return cjsRequire
				? (cjsRequire("node:sea") as typeof import("node:sea"))
				: null;
		} catch {
			return null;
		}
	})();

	if (sea?.isSea()) {
		const raw = sea.getAsset("postgres") as ArrayBuffer;
		const rawBuf = Buffer.from(raw);
		// Version the extraction by a hash of the (compressed) asset so a newer
		// dev binary — which carries a different embedded Postgres — extracts to a
		// fresh dir instead of reusing a stale runtime. Lives under the OS cache
		// dir, NOT /tmp: it survives reboot and isn't subject to a noexec /tmp mount.
		const version = createHash("sha256").update(rawBuf).digest("hex").slice(0, 12);
		const extractDir = join(postgresCacheRoot(), `postgres-${version}`);
		const sentinel = join(extractDir, ".extracted");
		if (!existsSync(sentinel)) {
			logger.info({ extractDir }, "Extracting embedded Postgres binary");
			// The asset is zstd-compressed by scripts/pack-postgres.js — decompress
			// before parsing the [header][bytes] layout.
			extractPostgresBlob(zstdDecompressSync(rawBuf), extractDir);
			writeFileSync(sentinel, "");
		}
		return join(extractDir, "bin");
	}

	// Dev: dynamic-import the platform binary package. It exports named
	// constants `postgres`, `initdb`, `pg_ctl` pointing at the absolute paths
	// inside its `native/bin/` directory.
	const platformPkg = (await import(getPlatformPackageName())) as {
		postgres?: string;
	};
	if (!platformPkg.postgres || typeof platformPkg.postgres !== "string") {
		throw new Error(
			"Could not resolve postgres binary path from @embedded-postgres/* package",
		);
	}
	return dirname(platformPkg.postgres);
}

/**
 * OS-idiomatic cache root for the extracted Postgres runtime. The extracted
 * binaries are a re-creatable cache, so they belong in the cache dir — which,
 * unlike /tmp, persists across reboots and is not mounted noexec.
 */
function postgresCacheRoot(): string {
	const home = homedir();
	if (process.platform === "win32") {
		return join(
			process.env.LOCALAPPDATA || join(home, "AppData", "Local"),
			"flowcatalyst",
			"postgres",
		);
	}
	if (process.platform === "darwin") {
		return join(home, "Library", "Caches", "flowcatalyst", "postgres");
	}
	return join(
		process.env.XDG_CACHE_HOME || join(home, ".cache"),
		"flowcatalyst",
		"postgres",
	);
}

function getPlatformPackageName(): string {
	const platform = process.platform;
	const arch = process.arch;
	const map: Record<string, string> = {
		"darwin-arm64": "@embedded-postgres/darwin-arm64",
		"darwin-x64": "@embedded-postgres/darwin-x64",
		"linux-arm64": "@embedded-postgres/linux-arm64",
		"linux-x64": "@embedded-postgres/linux-x64",
		"win32-x64": "@embedded-postgres/windows-x64",
	};
	const key = `${platform}-${arch}`;
	const name = map[key];
	if (!name) {
		throw new Error(`Unsupported platform for embedded Postgres: ${key}`);
	}
	return name;
}

/**
 * Decode the binary asset produced by scripts/pack-postgres.js into destDir.
 *
 * Format:
 *   [u32 BE: header length]
 *   [header JSON: { entries: { name, size, mode, link? }[] }]
 *   [raw bytes for each non-symlink entry]
 *
 * Files marked `link` are recreated as symlinks (relative target) after the
 * regular files have been written, so postgres can resolve its `@loader_path`
 * dylibs against the extracted lib/ directory.
 */
function extractPostgresBlob(blob: Buffer, destDir: string): void {
	if (blob.length < 4) throw new Error("postgres asset truncated");
	const headerLen = blob.readUInt32BE(0);
	const header = JSON.parse(
		blob.subarray(4, 4 + headerLen).toString("utf8"),
	) as {
		entries: { name: string; size: number; mode: number; link?: string }[];
	};

	// Wipe stale extraction dir so we don't merge with an older layout.
	if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true });
	mkdirSync(destDir, { recursive: true });

	let offset = 4 + headerLen;
	const symlinks: { name: string; link: string }[] = [];

	for (const entry of header.entries) {
		const outPath = join(destDir, entry.name);
		mkdirSync(dirname(outPath), { recursive: true });
		if (entry.link !== undefined) {
			// Defer symlink creation until after all regular files are in place.
			symlinks.push({ name: entry.name, link: entry.link });
			continue;
		}
		const bytes = blob.subarray(offset, offset + entry.size);
		offset += entry.size;
		writeFileSync(outPath, bytes);
		// Preserve executable bit so postgres/initdb/pg_ctl can run.
		if ((entry.mode & 0o111) !== 0) {
			chmodSync(outPath, entry.mode & 0o777);
		}
	}

	for (const s of symlinks) {
		const linkPath = join(destDir, s.name);
		try {
			rmSync(linkPath, { force: true });
		} catch {
			/* ignore */
		}
		symlinkSync(s.link, linkPath);
	}
}

function runOnce(cmd: string, args: string[]): Promise<void> {
	return new Promise((res, rej) => {
		const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
		let stderr = "";
		child.stderr?.on("data", (c: Buffer) => {
			stderr += c.toString();
		});
		child.on("error", rej);
		child.on("exit", (code) => {
			if (code === 0) res();
			else rej(new Error(`${cmd} exited ${code}: ${stderr.trim()}`));
		});
	});
}

/**
 * Poll-connect to `host:port` until Postgres accepts a TCP connection or we
 * hit `timeoutMs`. Postgres logs a "ready to accept connections" line earlier
 * than it actually does on slow boxes; a real connect test is more reliable.
 */
async function waitForReady(
	host: string,
	port: number,
	timeoutMs: number,
): Promise<void> {
	const { createConnection } = await import("node:net");
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		try {
			await new Promise<void>((res, rej) => {
				const sock = createConnection({ host, port });
				sock.once("connect", () => {
					sock.destroy();
					res();
				});
				sock.once("error", (e) => {
					sock.destroy();
					rej(e);
				});
			});
			return;
		} catch {
			await new Promise((r) => setTimeout(r, 200));
		}
	}
	throw new Error(
		`Embedded Postgres did not become ready on ${host}:${port} within ${timeoutMs}ms`,
	);
}

