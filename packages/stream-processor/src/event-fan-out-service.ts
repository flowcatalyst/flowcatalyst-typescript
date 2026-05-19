/**
 * Event Fan-Out Service
 *
 * Polls `msg_events` for rows where `fanned_out_at IS NULL`, matches them
 * against the active subscription set, batch-creates PENDING dispatch jobs,
 * and stamps `fanned_out_at` so each event is processed at-least-once.
 *
 * Replaces the synchronous fan-out previously embedded in the UnitOfWork
 * commit. Trade-off: the use case returns as soon as events are durably
 * stored; dispatch creation lags by at most the poll interval (~ms when
 * busy, up to 1s at idle).
 *
 * Jobs are inserted with status `PENDING`. The dispatch scheduler is
 * responsible for transitioning `PENDING → QUEUED` (publishing to the real
 * queue) — that keeps publish ownership in one place.
 *
 * At-least-once semantics: dispatch job insert + projection feed insert +
 * `fanned_out_at` stamp happen in one transaction.
 *
 * Concurrency: uses `FOR UPDATE SKIP LOCKED` on the claim. Any number of
 * pollers can run safely; only one will claim each row.
 *
 * --- Cutover note ---
 * This service is OFF by default to avoid double-fanning out while the
 * synchronous in-UoW path still runs. To cut over:
 *   1. Set FAN_OUT_SERVICE_ENABLED=true on the stream processor.
 *   2. Replace `EventDispatchService.buildDispatchJobsForEvent` with a
 *      no-op (or remove the call from UnitOfWork.commit). The poller now
 *      owns fan-out.
 *   3. Verify dispatch creation lag is acceptable for your SLO.
 */

import type postgres from "postgres";
import type { Logger } from "@flowcatalyst/logging";
import { generateRaw } from "@flowcatalyst/tsid";
import { StreamHealth } from "./stream-health.js";

export interface EventFanOutConfig {
	readonly enabled: boolean;
	/** Max events claimed per poll cycle. Default 200. */
	readonly batchSize: number;
	/** Subscription cache refresh interval in milliseconds. Default 5s. */
	readonly subscriptionRefreshMs: number;
}

export interface EventFanOutService {
	start(): void;
	stop(): void;
	isRunning(): boolean;
	readonly health: StreamHealth;
}

interface SubscriptionMatch {
	readonly id: string;
	readonly endpoint: string;
	readonly clientId: string | null;
	readonly mode: string;
	readonly dispatchPoolId: string | null;
	readonly connectionId: string | null;
	readonly serviceAccountId: string | null;
	readonly sequence: number;
	readonly timeoutSeconds: number;
	readonly maxRetries: number;
	readonly dataOnly: boolean;
	readonly code: string;
	readonly eventTypeCodes: string[];
}

interface ClaimedEvent {
	readonly id: string;
	readonly type: string;
	readonly source: string;
	readonly subject: string | null;
	readonly correlationId: string | null;
	readonly messageGroup: string | null;
	readonly clientId: string | null;
	readonly createdAt: Date;
}

export function createEventFanOutService(
	sql: postgres.Sql,
	config: EventFanOutConfig,
	logger: Logger,
): EventFanOutService {
	let running = false;
	const health = new StreamHealth("event-fan-out");
	const subsCache: { subs: SubscriptionMatch[]; refreshedAt: number } = {
		subs: [],
		refreshedAt: 0,
	};

	async function refreshSubscriptionsIfStale(): Promise<void> {
		const now = Date.now();
		if (now - subsCache.refreshedAt < config.subscriptionRefreshMs) return;

		try {
			// Load active subscriptions with their event-type bindings flattened.
			// Per the existing schema, event-type matching is exact code equality
			// (no wildcards) — we group by subscription so a single sub with
			// multiple bindings still appears once.
			const rows = await sql<
				{
					sub_id: string;
					endpoint: string;
					client_id: string | null;
					mode: string;
					dispatch_pool_id: string | null;
					connection_id: string | null;
					service_account_id: string | null;
					sequence: number;
					timeout_seconds: number;
					max_retries: number;
					data_only: boolean;
					code: string;
					event_type_codes: string[];
				}[]
			>`
				SELECT
					s.id AS sub_id,
					s.endpoint,
					s.client_id,
					s.mode,
					s.dispatch_pool_id,
					s.connection_id,
					s.service_account_id,
					s.sequence,
					s.timeout_seconds,
					s.max_retries,
					s.data_only,
					s.code,
					COALESCE(
						array_agg(set.event_type_code) FILTER (WHERE set.event_type_code IS NOT NULL),
						ARRAY[]::text[]
					) AS event_type_codes
				FROM msg_subscriptions s
				LEFT JOIN msg_subscription_event_types set ON set.subscription_id = s.id
				WHERE s.status = 'ACTIVE'
				GROUP BY s.id
			`;

			subsCache.subs = rows.map((r) => ({
				id: r.sub_id,
				endpoint: r.endpoint,
				clientId: r.client_id,
				mode: r.mode,
				dispatchPoolId: r.dispatch_pool_id,
				connectionId: r.connection_id,
				serviceAccountId: r.service_account_id,
				sequence: r.sequence,
				timeoutSeconds: r.timeout_seconds,
				maxRetries: r.max_retries,
				dataOnly: r.data_only,
				code: r.code,
				eventTypeCodes: r.event_type_codes,
			}));
			subsCache.refreshedAt = now;
		} catch (err) {
			logger.warn({ err }, "Failed to refresh subscriptions; using stale cache");
		}
	}

	function matches(sub: SubscriptionMatch, event: ClaimedEvent): boolean {
		if (!sub.eventTypeCodes.some((p) => patternMatches(p, event.type))) {
			return false;
		}
		// Subscription with a clientId only fires for events from that client.
		// Subscription without a clientId fires for any client.
		if (sub.clientId !== null && sub.clientId !== event.clientId) return false;
		return true;
	}

	async function pollOnce(): Promise<{ events: number; jobs: number }> {
		await refreshSubscriptionsIfStale();
		if (subsCache.subs.length === 0) {
			// Still claim and stamp events so they don't accumulate forever in
			// the partial index.
			const claimed = await sql<{ count: string }[]>`
				WITH batch AS (
					SELECT id, created_at FROM msg_events
					WHERE fanned_out_at IS NULL
					ORDER BY created_at
					LIMIT ${config.batchSize}
					FOR UPDATE SKIP LOCKED
				)
				UPDATE msg_events e
				SET fanned_out_at = NOW()
				FROM batch b
				WHERE e.id = b.id AND e.created_at = b.created_at
				RETURNING 1
			`;
			return { events: claimed.length, jobs: 0 };
		}

		// Single transaction: claim events, build jobs in JS, insert jobs +
		// projection feed entries.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = await sql.begin(async (tx: any) => {
			const claimedRows = (await tx`
				WITH batch AS (
					SELECT id, created_at FROM msg_events
					WHERE fanned_out_at IS NULL
					ORDER BY created_at
					LIMIT ${config.batchSize}
					FOR UPDATE SKIP LOCKED
				)
				UPDATE msg_events e
				SET fanned_out_at = NOW()
				FROM batch b
				WHERE e.id = b.id AND e.created_at = b.created_at
				RETURNING e.id, e.type, e.source, e.subject, e.correlation_id,
					e.message_group, e.client_id, e.created_at
			`) as Array<{
				id: string;
				type: string;
				source: string;
				subject: string | null;
				correlation_id: string | null;
				message_group: string | null;
				client_id: string | null;
				created_at: Date;
			}>;

			if (claimedRows.length === 0) return { events: 0, jobs: 0 };

			const events: ClaimedEvent[] = claimedRows.map((r) => ({
				id: r.id,
				type: r.type,
				source: r.source,
				subject: r.subject,
				correlationId: r.correlation_id,
				messageGroup: r.message_group,
				clientId: r.client_id,
				createdAt: r.created_at,
			}));

			// Build column arrays for batched UNNEST inserts. Avoids N
			// round-trips per batch (the previous per-row INSERT loop) — at
			// peak 10 subs × 200 events = 2000 inserts per cycle, which the
			// row-by-row form can't sustain at 5K events/sec.
			const ids: string[] = [];
			const codes: string[] = [];
			const sources: string[] = [];
			const subjects: (string | null)[] = [];
			const eventIds: string[] = [];
			const correlationIds: (string | null)[] = [];
			const targetUrls: string[] = [];
			const dataOnlys: boolean[] = [];
			const serviceAccountIds: (string | null)[] = [];
			const clientIds: (string | null)[] = [];
			const subscriptionIds: string[] = [];
			const connectionIds: (string | null)[] = [];
			const modes: string[] = [];
			const dispatchPoolIds: (string | null)[] = [];
			const messageGroups: string[] = [];
			const sequences: number[] = [];
			const timeoutSeconds: number[] = [];
			const maxRetries: number[] = [];
			const idempotencyKeys: string[] = [];
			const createdAts: Date[] = [];
			// Pre-serialised payloads for the projection feed insert.
			const feedPayloads: string[] = [];

			for (const event of events) {
				for (const sub of subsCache.subs) {
					if (!matches(sub, event)) continue;

					const jobId = generateRaw();
					const idempotencyKey = `${event.id}:${sub.id}`;
					const messageGroup = `${sub.code}:${event.messageGroup ?? "default"}`;

					ids.push(jobId);
					codes.push(event.type);
					sources.push(event.source);
					subjects.push(event.subject);
					eventIds.push(event.id);
					correlationIds.push(event.correlationId);
					targetUrls.push(sub.endpoint);
					dataOnlys.push(sub.dataOnly);
					serviceAccountIds.push(sub.serviceAccountId);
					clientIds.push(event.clientId);
					subscriptionIds.push(sub.id);
					connectionIds.push(sub.connectionId);
					modes.push(sub.mode);
					dispatchPoolIds.push(sub.dispatchPoolId);
					messageGroups.push(messageGroup);
					sequences.push(sub.sequence);
					timeoutSeconds.push(sub.timeoutSeconds);
					maxRetries.push(sub.maxRetries);
					idempotencyKeys.push(idempotencyKey);
					// Inherit source event createdAt: preserves message_group
					// ordering for the scheduler poll, and co-locates events
					// and their dispatch jobs in the same monthly partition.
					createdAts.push(event.createdAt);

					// Projection feed payload mirrors the row, JSON-serialised
					// once for the JSONB array bind.
					feedPayloads.push(
						JSON.stringify({
							id: jobId,
							kind: "EVENT",
							code: event.type,
							source: event.source,
							subject: event.subject,
							eventId: event.id,
							correlationId: event.correlationId,
							targetUrl: sub.endpoint,
							protocol: "HTTP_WEBHOOK",
							dataOnly: sub.dataOnly,
							serviceAccountId: sub.serviceAccountId,
							clientId: event.clientId,
							subscriptionId: sub.id,
							connectionId: sub.connectionId,
							mode: sub.mode,
							dispatchPoolId: sub.dispatchPoolId,
							messageGroup,
							sequence: sub.sequence,
							timeoutSeconds: sub.timeoutSeconds,
							status: "PENDING",
							maxRetries: sub.maxRetries,
							attemptCount: 0,
							idempotencyKey,
							createdAt: event.createdAt,
							updatedAt: event.createdAt,
						}),
					);
				}
			}

			const jobCount = ids.length;

			if (jobCount > 0) {
				// One INSERT for all dispatch jobs in this cycle. Constants
				// (kind, protocol, status, attempt_count) come from the SELECT
				// projection — no need for per-row arrays of repeating values.
				await tx`
					INSERT INTO msg_dispatch_jobs (
						id, kind, code, source, subject, event_id, correlation_id,
						target_url, protocol, data_only, service_account_id, client_id,
						subscription_id, connection_id, mode, dispatch_pool_id,
						message_group, sequence, timeout_seconds, status, max_retries,
						attempt_count, idempotency_key, created_at, updated_at
					)
					SELECT
						id, 'EVENT', code, source, subject, event_id, correlation_id,
						target_url, 'HTTP_WEBHOOK', data_only, service_account_id, client_id,
						subscription_id, connection_id, mode, dispatch_pool_id,
						message_group, sequence, timeout_seconds, 'PENDING', max_retries,
						0, idempotency_key, created_at, created_at
					FROM UNNEST(
						${ids}::varchar[],
						${codes}::varchar[],
						${sources}::varchar[],
						${subjects}::varchar[],
						${eventIds}::varchar[],
						${correlationIds}::varchar[],
						${targetUrls}::varchar[],
						${dataOnlys}::boolean[],
						${serviceAccountIds}::varchar[],
						${clientIds}::varchar[],
						${subscriptionIds}::varchar[],
						${connectionIds}::varchar[],
						${modes}::varchar[],
						${dispatchPoolIds}::varchar[],
						${messageGroups}::varchar[],
						${sequences}::int4[],
						${timeoutSeconds}::int4[],
						${maxRetries}::int4[],
						${idempotencyKeys}::varchar[],
						${createdAts}::timestamptz[]
					) AS t(
						id, code, source, subject, event_id, correlation_id,
						target_url, data_only, service_account_id, client_id,
						subscription_id, connection_id, mode, dispatch_pool_id,
						message_group, sequence, timeout_seconds, max_retries,
						idempotency_key, created_at
					)
				`;

				// One INSERT for all projection-feed entries. bigserial id +
				// processed default to 0 are filled by column defaults.
				await tx`
					INSERT INTO msg_dispatch_job_projection_feed (
						dispatch_job_id, operation, payload
					)
					SELECT id, 'INSERT', payload
					FROM UNNEST(
						${ids}::varchar[],
						${feedPayloads}::jsonb[]
					) AS t(id, payload)
				`;
			}

			return { events: events.length, jobs: jobCount };
		});

		return result;
	}

	async function pollLoop(): Promise<void> {
		while (running) {
			try {
				const { events, jobs } = await pollOnce();
				if (events > 0) {
					health.addProcessed(jobs);
					logger.debug({ events, jobs }, "Fan-out cycle");
				}
				if (events === 0) {
					await sleep(1000);
				} else if (events < config.batchSize) {
					await sleep(100);
				}
				// Full batch: no sleep, immediately poll again.
			} catch (err) {
				if (!running) break;
				health.recordError();
				logger.error({ err }, "Error in event fan-out poll loop");
				await sleep(5000);
			}
		}
	}

	function start(): void {
		if (running) {
			logger.warn("Event fan-out service already running");
			return;
		}
		running = true;
		health.setRunning(true);
		pollLoop().catch((err) => {
			logger.error({ err }, "Event fan-out poll loop exited unexpectedly");
			running = false;
			health.setRunning(false);
		});
		logger.info(
			{ batchSize: config.batchSize },
			"Event fan-out service started",
		);
	}

	function stop(): void {
		if (!running) return;
		logger.info("Stopping event fan-out service...");
		running = false;
		health.setRunning(false);
		logger.info("Event fan-out service stopped");
	}

	return { start, stop, isRunning: () => running, health };
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * `:`-separated wildcard match. Segment counts must agree and `*`
 * matches any single segment — e.g. `orders:*:shipped` matches
 * `orders:fulfillment:shipped` but not `orders:shipped` or
 * `orders:fulfillment:warehouse:shipped`. Mirrors Rust
 * `crates/fc-stream/src/event_fan_out.rs::pattern_matches`.
 */
function patternMatches(pattern: string, code: string): boolean {
	if (pattern === code) return true;
	const pp = pattern.split(":");
	const cp = code.split(":");
	if (pp.length !== cp.length) return false;
	for (let i = 0; i < pp.length; i++) {
		if (pp[i] !== "*" && pp[i] !== cp[i]) return false;
	}
	return true;
}
