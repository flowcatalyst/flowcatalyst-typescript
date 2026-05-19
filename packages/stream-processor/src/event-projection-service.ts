/**
 * Event Projection Service
 *
 * Projects events from `msg_events` directly into `msg_events_read`
 * using a single atomic CTE. Reads rows where `projected_at IS NULL`,
 * inserts them into the read model (parsing `application:subdomain:
 * aggregate` from `type`), and stamps `projected_at` to mark them
 * projected. Mirrors Rust `crates/fc-stream/src/event_projection.rs`.
 *
 * Previously this service drained `msg_event_projection_feed`; the
 * feed table has been retired — projection reads the write model
 * directly.
 *
 * Adaptive sleep:
 *   - Full batch: poll again immediately
 *   - Partial batch: 100ms
 *   - Empty: 1000ms
 *   - Error: 5000ms
 */

import type postgres from "postgres";
import type { Logger } from "@flowcatalyst/logging";
import { StreamHealth, type StreamHealthSnapshot } from "./stream-health.js";

export interface EventProjectionConfig {
	readonly enabled: boolean;
	readonly batchSize: number;
}

export interface EventProjectionService {
	start(): void;
	stop(): void;
	isRunning(): boolean;
	getHealth(): StreamHealthSnapshot;
	readonly health: StreamHealth;
}

export function createEventProjectionService(
	sql: postgres.Sql,
	config: EventProjectionConfig,
	logger: Logger,
): EventProjectionService {
	let running = false;
	const health = new StreamHealth("event-projection");

	async function pollAndProject(): Promise<number> {
		const result = await sql`
			WITH batch AS (
				SELECT id, created_at
				FROM msg_events
				WHERE projected_at IS NULL
				ORDER BY created_at
				LIMIT ${config.batchSize}
			),
			projected AS (
				INSERT INTO msg_events_read (
					id, spec_version, type, source, subject, time, data,
					correlation_id, causation_id, deduplication_id, message_group,
					client_id, application, subdomain, aggregate, created_at, projected_at
				)
				SELECT
					e.id,
					e.spec_version,
					e.type,
					e.source,
					e.subject,
					e.time,
					e.data::text,
					e.correlation_id,
					e.causation_id,
					e.deduplication_id,
					e.message_group,
					e.client_id,
					split_part(e.type, ':', 1),
					NULLIF(split_part(e.type, ':', 2), ''),
					NULLIF(split_part(e.type, ':', 3), ''),
					e.created_at,
					NOW()
				FROM msg_events e
				JOIN batch b ON b.id = e.id AND b.created_at = e.created_at
				ON CONFLICT (id, created_at) DO NOTHING
			)
			UPDATE msg_events m
			SET projected_at = NOW()
			FROM batch b
			WHERE m.id = b.id AND m.created_at = b.created_at
		`;

		const count = result.count;
		if (count > 0) {
			health.addProcessed(count);
			logger.debug({ count }, "Projected events");
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
				logger.error({ err }, "Error in event projection poll loop");
				await sleep(5000);
			}
		}
	}

	function start(): void {
		if (running) {
			logger.warn("Event projection service already running");
			return;
		}
		running = true;
		health.setRunning(true);
		pollLoop().catch((err) => {
			logger.error({ err }, "Event projection poll loop exited unexpectedly");
			running = false;
			health.setRunning(false);
		});
		logger.info(
			{ batchSize: config.batchSize },
			"Event projection service started",
		);
	}

	function stop(): void {
		if (!running) return;
		logger.info("Stopping event projection service...");
		running = false;
		health.setRunning(false);
		logger.info("Event projection service stopped");
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
