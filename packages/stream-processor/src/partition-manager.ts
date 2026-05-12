/**
 * Partition Manager
 *
 * Background task that maintains the rolling window of monthly partitions on
 * the partitioned messaging tables:
 *   - msg_events
 *   - msg_events_read
 *   - msg_dispatch_jobs
 *   - msg_dispatch_jobs_read
 *   - msg_dispatch_job_attempts
 *   - msg_scheduled_job_instances
 *   - msg_scheduled_job_instance_logs
 *
 * Each tick:
 *   1. Ensures monthly partitions exist for the next N months on each parent.
 *   2. Drops partitions whose date range falls before the retention cutoff
 *      (default 90 days).
 *
 * Auto-bails at startup if msg_events is not a declarative partitioned table
 * (e.g. running on PGlite for embedded dev) — there's nothing to manage.
 *
 * Partition naming convention: `<parent>_YYYY_MM`. The manager parses the
 * `YYYY_MM` suffix to determine partition age.
 */

import type postgres from "postgres";
import type { Logger } from "@flowcatalyst/logging";

const PARTITIONED_PARENTS = [
	"msg_events",
	"msg_events_read",
	"msg_dispatch_jobs",
	"msg_dispatch_jobs_read",
	"msg_dispatch_job_attempts",
	"msg_scheduled_job_instances",
	"msg_scheduled_job_instance_logs",
] as const;

export interface PartitionManagerConfig {
	readonly enabled: boolean;
	/** How many forward monthly partitions to keep ahead of the current month. Default 3. */
	readonly monthsForward: number;
	/** Drop partitions whose end-of-range is older than this many days. Default 90. */
	readonly retentionDays: number;
	/** Tick interval in milliseconds. Default 24h. */
	readonly tickIntervalMs: number;
}

export interface PartitionManagerService {
	start(): void;
	stop(): void;
	isRunning(): boolean;
}

export const DEFAULT_PARTITION_MANAGER_CONFIG: PartitionManagerConfig = {
	enabled: true,
	monthsForward: 3,
	retentionDays: 90,
	tickIntervalMs: 24 * 60 * 60 * 1000,
};

export function createPartitionManagerService(
	sql: postgres.Sql,
	config: PartitionManagerConfig,
	logger: Logger,
): PartitionManagerService {
	let running = false;
	let timer: NodeJS.Timeout | null = null;

	async function isPartitioned(table: string): Promise<boolean> {
		const rows = await sql<{ exists: boolean }[]>`
			SELECT EXISTS (
				SELECT 1
				FROM pg_partitioned_table pt
				JOIN pg_class c ON c.oid = pt.partrelid
				WHERE c.relname = ${table}
			) AS exists
		`;
		return rows[0]?.exists === true;
	}

	function monthStart(now: Date, offset: number): Date {
		const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
		return d;
	}

	async function ensureForwardPartitions(parent: string, now: Date): Promise<number> {
		let created = 0;
		for (let offset = 0; offset <= config.monthsForward; offset++) {
			const start = monthStart(now, offset);
			const end = monthStart(now, offset + 1);
			const yyyy = start.getUTCFullYear();
			const mm = String(start.getUTCMonth() + 1).padStart(2, "0");
			const partitionName = `${parent}_${yyyy}_${mm}`;

			// IF NOT EXISTS makes this idempotent across ticks.
			await sql.unsafe(
				`CREATE TABLE IF NOT EXISTS ${quoteIdent(partitionName)} ` +
					`PARTITION OF ${quoteIdent(parent)} ` +
					`FOR VALUES FROM ('${start.toISOString()}') TO ('${end.toISOString()}')`,
			);
			created++;
		}
		return created;
	}

	async function dropOldPartitions(parent: string, now: Date): Promise<number> {
		const cutoff = new Date(now.getTime() - config.retentionDays * 24 * 60 * 60 * 1000);

		const rows = await sql<{ relname: string }[]>`
			SELECT child.relname
			FROM pg_inherits i
			JOIN pg_class parent ON i.inhparent = parent.oid
			JOIN pg_class child ON i.inhrelid = child.oid
			WHERE parent.relname = ${parent}
		`;

		let dropped = 0;
		for (const row of rows) {
			const end = parsePartitionEnd(row.relname, parent);
			if (end && end <= cutoff) {
				try {
					await sql.unsafe(`DROP TABLE IF EXISTS ${quoteIdent(row.relname)}`);
					logger.info({ partition: row.relname }, "Dropped expired partition");
					dropped++;
				} catch (err) {
					logger.warn({ err, partition: row.relname }, "Failed to drop partition");
				}
			}
		}
		return dropped;
	}

	async function tick(): Promise<{ created: number; dropped: number }> {
		const now = new Date();
		let createdTotal = 0;
		let droppedTotal = 0;

		for (const parent of PARTITIONED_PARENTS) {
			try {
				createdTotal += await ensureForwardPartitions(parent, now);
			} catch (err) {
				logger.warn({ err, parent }, "Failed to ensure forward partitions");
			}
			try {
				droppedTotal += await dropOldPartitions(parent, now);
			} catch (err) {
				logger.warn({ err, parent }, "Failed to drop old partitions");
			}
		}

		return { created: createdTotal, dropped: droppedTotal };
	}

	async function startInternal(): Promise<void> {
		if (!(await isPartitioned("msg_events"))) {
			logger.info(
				"Partition manager: msg_events is not partitioned; manager will not run",
			);
			running = false;
			return;
		}

		logger.info(
			{
				monthsForward: config.monthsForward,
				retentionDays: config.retentionDays,
			},
			"Partition manager started",
		);

		// Run once immediately.
		await safeTick();

		// Then on interval.
		timer = setInterval(() => {
			void safeTick();
		}, config.tickIntervalMs);
	}

	async function safeTick(): Promise<void> {
		if (!running) return;
		try {
			const { created, dropped } = await tick();
			if (created > 0 || dropped > 0) {
				logger.info({ created, dropped }, "Partition manager tick");
			} else {
				logger.debug("Partition manager tick: nothing to do");
			}
		} catch (err) {
			logger.error({ err }, "Partition manager tick failed");
		}
	}

	function start(): void {
		if (running) {
			logger.warn("Partition manager already running");
			return;
		}
		running = true;
		startInternal().catch((err) => {
			logger.error({ err }, "Partition manager start failed");
			running = false;
		});
	}

	function stop(): void {
		if (!running) return;
		running = false;
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		logger.info("Partition manager stopped");
	}

	return { start, stop, isRunning: () => running };
}

/**
 * Parse the end-of-range timestamp from a partition name like
 * `msg_events_2026_05`. Returns the start of the *following* month so the
 * caller can compare against `now - retention`.
 */
function parsePartitionEnd(partition: string, parent: string): Date | null {
	const prefix = `${parent}_`;
	if (!partition.startsWith(prefix)) return null;
	const suffix = partition.slice(prefix.length);
	const match = /^(\d{4})_(\d{2})$/.exec(suffix);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	if (month < 1 || month > 12) return null;
	// Start of the next month
	let nextYear = year;
	let nextMonth = month + 1;
	if (nextMonth > 12) {
		nextMonth = 1;
		nextYear += 1;
	}
	return new Date(Date.UTC(nextYear, nextMonth - 1, 1));
}

/**
 * Minimal identifier quoting. Partition names are derived from a fixed
 * allow-list (`PARTITIONED_PARENTS`) plus a date stamp, so this is just
 * belt-and-braces — it's never given untrusted input.
 */
function quoteIdent(s: string): string {
	const escaped = s.replace(/"/g, '""');
	return `"${escaped}"`;
}
