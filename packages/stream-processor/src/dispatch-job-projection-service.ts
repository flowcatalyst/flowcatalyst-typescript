/**
 * Dispatch Job Projection Service
 *
 * Projects dispatch jobs from `msg_dispatch_jobs` directly into
 * `msg_dispatch_jobs_read`. Picks up rows that are either new
 * (`projected_at IS NULL`) or updated since last projection
 * (`updated_at > projected_at`), upserts into the read model, and
 * stamps `projected_at`. Mirrors Rust
 * `crates/fc-stream/src/dispatch_job_projection.rs`.
 *
 * Previously this service drained `msg_dispatch_job_projection_feed`;
 * the feed table has been retired — projection reads the write model
 * directly.
 *
 * `is_completed` / `is_terminal` are derived from `status` in-engine
 * (no application-layer transfer). Type hierarchy parsing of
 * `application:subdomain:aggregate` mirrors event projection.
 */

import type postgres from "postgres";
import type { Logger } from "@flowcatalyst/logging";
import { StreamHealth, type StreamHealthSnapshot } from "./stream-health.js";

export interface DispatchJobProjectionConfig {
	readonly enabled: boolean;
	readonly batchSize: number;
}

export interface DispatchJobProjectionService {
	start(): void;
	stop(): void;
	isRunning(): boolean;
	getHealth(): StreamHealthSnapshot;
	readonly health: StreamHealth;
}

export function createDispatchJobProjectionService(
	sql: postgres.Sql,
	config: DispatchJobProjectionConfig,
	logger: Logger,
): DispatchJobProjectionService {
	let running = false;
	const health = new StreamHealth("dispatch-job-projection");

	async function pollAndProject(): Promise<number> {
		const result = await sql`
			WITH batch AS (
				SELECT id, created_at
				FROM msg_dispatch_jobs
				WHERE projected_at IS NULL
				   OR updated_at > projected_at
				ORDER BY created_at
				LIMIT ${config.batchSize}
			),
			projected AS (
				INSERT INTO msg_dispatch_jobs_read (
					id, external_id, source, kind, code, subject, event_id, correlation_id,
					target_url, protocol, service_account_id, client_id, subscription_id,
					mode, dispatch_pool_id, message_group, sequence, timeout_seconds,
					status, max_retries, retry_strategy, scheduled_for, expires_at,
					attempt_count, last_attempt_at, completed_at, duration_millis, last_error,
					idempotency_key, is_completed, is_terminal,
					application, subdomain, aggregate,
					created_at, updated_at, projected_at
				)
				SELECT
					j.id, j.external_id, j.source, j.kind, j.code, j.subject,
					j.event_id, j.correlation_id, j.target_url, j.protocol,
					j.service_account_id, j.client_id, j.subscription_id,
					j.mode, j.dispatch_pool_id, j.message_group,
					j.sequence, j.timeout_seconds, j.status,
					j.max_retries, j.retry_strategy,
					j.scheduled_for, j.expires_at,
					j.attempt_count, j.last_attempt_at, j.completed_at,
					j.duration_millis, j.last_error, j.idempotency_key,
					j.status IN ('SUCCESS', 'FAILED', 'IGNORED', 'CANCELLED', 'EXPIRED') AS is_completed,
					j.status IN ('FAILED', 'IGNORED', 'CANCELLED', 'EXPIRED') AS is_terminal,
					split_part(j.code, ':', 1),
					NULLIF(split_part(j.code, ':', 2), ''),
					NULLIF(split_part(j.code, ':', 3), ''),
					j.created_at, j.updated_at, NOW()
				FROM msg_dispatch_jobs j
				JOIN batch b ON b.id = j.id AND b.created_at = j.created_at
				ON CONFLICT (id, created_at) DO UPDATE SET
					status = EXCLUDED.status,
					attempt_count = EXCLUDED.attempt_count,
					last_attempt_at = EXCLUDED.last_attempt_at,
					completed_at = EXCLUDED.completed_at,
					duration_millis = EXCLUDED.duration_millis,
					last_error = EXCLUDED.last_error,
					is_completed = EXCLUDED.is_completed,
					is_terminal = EXCLUDED.is_terminal,
					updated_at = EXCLUDED.updated_at,
					projected_at = NOW()
			)
			UPDATE msg_dispatch_jobs m
			SET projected_at = NOW()
			FROM batch b
			WHERE m.id = b.id AND m.created_at = b.created_at
		`;

		const count = result.count;
		if (count > 0) {
			health.addProcessed(count);
			logger.debug({ count }, "Projected dispatch job changes");
		}
		return count;
	}

	async function pollLoop(): Promise<void> {
		while (running) {
			try {
				const processed = await pollAndProject();
				if (processed === 0) {
					await sleep(1000);
				} else if (processed < config.batchSize) {
					await sleep(100);
				}
			} catch (err) {
				if (!running) break;
				health.recordError();
				logger.error({ err }, "Error in dispatch job projection poll loop");
				await sleep(5000);
			}
		}
	}

	function start(): void {
		if (running) {
			logger.warn("Dispatch job projection service already running");
			return;
		}
		running = true;
		health.setRunning(true);
		pollLoop().catch((err) => {
			logger.error(
				{ err },
				"Dispatch job projection poll loop exited unexpectedly",
			);
			running = false;
			health.setRunning(false);
		});
		logger.info(
			{ batchSize: config.batchSize },
			"Dispatch job projection service started",
		);
	}

	function stop(): void {
		if (!running) return;
		logger.info("Stopping dispatch job projection service...");
		running = false;
		health.setRunning(false);
		logger.info("Dispatch job projection service stopped");
	}

	return {
		start,
		stop,
		isRunning: () => running,
		getHealth: () => health.snapshot(),
		health,
	};
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
