/**
 * ScheduledJob Repository
 *
 * Owns the write path for the ScheduledJob aggregate through the UnitOfWork
 * (`persist` / `delete`). Direct write methods (e.g. `markFired`) are reserved
 * for the platform-infrastructure poller — analogous to dispatch-job delivery
 * lifecycle, they bypass the UoW so the cron tick doesn't emit a domain event
 * per firing.
 *
 * Instance + log writes live in `scheduled-job-instance-repository.ts`.
 */

import { and, eq, isNull, sql, ilike, or, desc } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Repository, TransactionContext } from "@flowcatalyst/persistence";

import {
	scheduledJobs,
	type ScheduledJobRecord,
	type NewScheduledJobRecord,
} from "../schema/index.js";
import type {
	ScheduledJob,
	NewScheduledJob,
	ScheduledJobStatus,
} from "../../../domain/index.js";
import { parseScheduledJobStatus } from "../../../domain/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

export interface ScheduledJobFilters {
	/**
	 * When provided: { clientId: null } = platform-scoped jobs;
	 * { clientId: string } = client-scoped to that client.
	 * Omit entirely to skip the filter.
	 */
	readonly clientId?: string | null | undefined;
	readonly applyClientFilter?: boolean | undefined;
	readonly status?: ScheduledJobStatus | undefined;
	readonly search?: string | undefined;
	readonly limit?: number | undefined;
	readonly offset?: number | undefined;
}

export interface ScheduledJobRepository extends Repository<ScheduledJob> {
	findByCode(
		clientId: string | null,
		code: string,
		tx?: TransactionContext,
	): Promise<ScheduledJob | undefined>;
	findByClientId(
		clientId: string,
		tx?: TransactionContext,
	): Promise<ScheduledJob[]>;
	findWithFilters(
		filters: ScheduledJobFilters,
		tx?: TransactionContext,
	): Promise<ScheduledJob[]>;
	countWithFilters(
		filters: Omit<ScheduledJobFilters, "limit" | "offset">,
		tx?: TransactionContext,
	): Promise<number>;
	/** All ACTIVE jobs, ordered oldest-last-fired-first. Used by the poller. */
	findActiveForPolling(tx?: TransactionContext): Promise<ScheduledJob[]>;
	/**
	 * Poller-only: advance last_fired_at to the supplied slot. Idempotent —
	 * uses GREATEST so a re-run of the same tick is a no-op. Bypasses UoW.
	 */
	markFired(id: string, slot: Date, tx?: TransactionContext): Promise<void>;
}

export function createScheduledJobRepository(
	defaultDb: AnyDb,
): ScheduledJobRepository {
	const db = (tx?: TransactionContext): AnyDb =>
		(tx?.db as AnyDb) ?? defaultDb;

	function recordToEntity(r: ScheduledJobRecord): ScheduledJob {
		return {
			id: r.id,
			clientId: r.clientId,
			code: r.code,
			name: r.name,
			description: r.description,
			status: parseScheduledJobStatus(r.status),
			crons: (r.crons as string[]) ?? [],
			timezone: r.timezone,
			payload: r.payload ?? null,
			concurrent: r.concurrent,
			tracksCompletion: r.tracksCompletion,
			timeoutSeconds: r.timeoutSeconds ?? null,
			deliveryMaxAttempts: r.deliveryMaxAttempts,
			targetUrl: r.targetUrl ?? null,
			lastFiredAt: r.lastFiredAt ?? null,
			createdAt: r.createdAt,
			updatedAt: r.updatedAt,
			createdBy: r.createdBy ?? null,
			updatedBy: r.updatedBy ?? null,
			version: r.version,
		};
	}

	function entityToRecord(e: NewScheduledJob): NewScheduledJobRecord {
		return {
			id: e.id,
			clientId: e.clientId,
			code: e.code,
			name: e.name,
			description: e.description,
			status: e.status,
			crons: e.crons as string[],
			timezone: e.timezone,
			payload: e.payload as unknown,
			concurrent: e.concurrent,
			tracksCompletion: e.tracksCompletion,
			timeoutSeconds: e.timeoutSeconds,
			deliveryMaxAttempts: e.deliveryMaxAttempts,
			targetUrl: e.targetUrl,
			lastFiredAt: e.lastFiredAt,
			createdAt: e.createdAt ?? new Date(),
			updatedAt: e.updatedAt ?? new Date(),
			createdBy: e.createdBy,
			updatedBy: e.updatedBy,
			version: e.version,
		};
	}

	function buildFilterConditions(filters: ScheduledJobFilters) {
		const conditions = [];
		if (filters.applyClientFilter) {
			if (filters.clientId === null || filters.clientId === undefined) {
				conditions.push(isNull(scheduledJobs.clientId));
			} else {
				conditions.push(eq(scheduledJobs.clientId, filters.clientId));
			}
		}
		if (filters.status) {
			conditions.push(eq(scheduledJobs.status, filters.status));
		}
		if (filters.search && filters.search.length > 0) {
			const like = `%${filters.search}%`;
			conditions.push(
				or(
					ilike(scheduledJobs.code, like),
					ilike(scheduledJobs.name, like),
				)!,
			);
		}
		return conditions;
	}

	return {
		async findById(
			id: string,
			tx?: TransactionContext,
		): Promise<ScheduledJob | undefined> {
			const [r] = await db(tx)
				.select()
				.from(scheduledJobs)
				.where(eq(scheduledJobs.id, id))
				.limit(1);
			return r ? recordToEntity(r) : undefined;
		},

		async findByCode(
			clientId: string | null,
			code: string,
			tx?: TransactionContext,
		): Promise<ScheduledJob | undefined> {
			const cond =
				clientId === null
					? and(isNull(scheduledJobs.clientId), eq(scheduledJobs.code, code))
					: and(
							eq(scheduledJobs.clientId, clientId),
							eq(scheduledJobs.code, code),
						);
			const [r] = await db(tx).select().from(scheduledJobs).where(cond).limit(1);
			return r ? recordToEntity(r) : undefined;
		},

		async findAll(tx?: TransactionContext): Promise<ScheduledJob[]> {
			const records = await db(tx)
				.select()
				.from(scheduledJobs)
				.orderBy(desc(scheduledJobs.createdAt));
			return records.map(recordToEntity);
		},

		async findByClientId(
			clientId: string,
			tx?: TransactionContext,
		): Promise<ScheduledJob[]> {
			const records = await db(tx)
				.select()
				.from(scheduledJobs)
				.where(eq(scheduledJobs.clientId, clientId))
				.orderBy(desc(scheduledJobs.createdAt));
			return records.map(recordToEntity);
		},

		async findWithFilters(
			filters: ScheduledJobFilters,
			tx?: TransactionContext,
		): Promise<ScheduledJob[]> {
			const conditions = buildFilterConditions(filters);
			let q = db(tx).select().from(scheduledJobs).$dynamic();
			if (conditions.length > 0) {
				q = q.where(conditions.length === 1 ? conditions[0]! : and(...conditions));
			}
			q = q.orderBy(desc(scheduledJobs.createdAt));
			if (filters.limit !== undefined) q = q.limit(filters.limit);
			if (filters.offset !== undefined) q = q.offset(filters.offset);
			const records = await q;
			return records.map(recordToEntity);
		},

		async countWithFilters(
			filters: Omit<ScheduledJobFilters, "limit" | "offset">,
			tx?: TransactionContext,
		): Promise<number> {
			const conditions = buildFilterConditions(filters);
			let q = db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(scheduledJobs)
				.$dynamic();
			if (conditions.length > 0) {
				q = q.where(conditions.length === 1 ? conditions[0]! : and(...conditions));
			}
			const [r] = await q;
			return Number(r?.count ?? 0);
		},

		async findActiveForPolling(
			tx?: TransactionContext,
		): Promise<ScheduledJob[]> {
			const records = await db(tx)
				.select()
				.from(scheduledJobs)
				.where(eq(scheduledJobs.status, "ACTIVE"))
				.orderBy(sql`last_fired_at NULLS FIRST`);
			return records.map(recordToEntity);
		},

		async markFired(
			id: string,
			slot: Date,
			tx?: TransactionContext,
		): Promise<void> {
			await db(tx)
				.update(scheduledJobs)
				.set({ lastFiredAt: sql`GREATEST(last_fired_at, ${slot})` })
				.where(eq(scheduledJobs.id, id));
		},

		async count(tx?: TransactionContext): Promise<number> {
			const [r] = await db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(scheduledJobs);
			return Number(r?.count ?? 0);
		},

		async exists(id: string, tx?: TransactionContext): Promise<boolean> {
			const [r] = await db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(scheduledJobs)
				.where(eq(scheduledJobs.id, id));
			return Number(r?.count ?? 0) > 0;
		},

		async insert(
			entity: NewScheduledJob,
			tx?: TransactionContext,
		): Promise<ScheduledJob> {
			await db(tx).insert(scheduledJobs).values(entityToRecord(entity));
			const found = await this.findById(entity.id, tx);
			if (!found) throw new Error("Inserted scheduled job not found");
			return found;
		},

		async update(
			entity: ScheduledJob,
			tx?: TransactionContext,
		): Promise<ScheduledJob> {
			// last_fired_at is owned by the poller via markFired() — excluded here.
			await db(tx)
				.update(scheduledJobs)
				.set({
					clientId: entity.clientId,
					code: entity.code,
					name: entity.name,
					description: entity.description,
					status: entity.status,
					crons: entity.crons as string[],
					timezone: entity.timezone,
					payload: entity.payload as unknown,
					concurrent: entity.concurrent,
					tracksCompletion: entity.tracksCompletion,
					timeoutSeconds: entity.timeoutSeconds,
					deliveryMaxAttempts: entity.deliveryMaxAttempts,
					targetUrl: entity.targetUrl,
					updatedAt: entity.updatedAt,
					updatedBy: entity.updatedBy,
					version: entity.version,
				})
				.where(eq(scheduledJobs.id, entity.id));
			const found = await this.findById(entity.id, tx);
			if (!found) throw new Error("Updated scheduled job not found");
			return found;
		},

		async persist(
			entity: NewScheduledJob,
			tx?: TransactionContext,
		): Promise<ScheduledJob> {
			const existing = await this.exists(entity.id, tx);
			if (existing) return this.update(entity as ScheduledJob, tx);
			return this.insert(entity, tx);
		},

		async deleteById(id: string, tx?: TransactionContext): Promise<boolean> {
			const exists = await this.exists(id, tx);
			if (!exists) return false;
			await db(tx).delete(scheduledJobs).where(eq(scheduledJobs.id, id));
			return true;
		},

		async delete(
			entity: ScheduledJob,
			tx?: TransactionContext,
		): Promise<boolean> {
			return this.deleteById(entity.id, tx);
		},
	};
}
