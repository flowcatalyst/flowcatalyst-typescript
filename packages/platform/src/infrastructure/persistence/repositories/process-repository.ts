/**
 * Process Repository
 *
 * Data access for Process entities. Drizzle write paths, simple read paths.
 */

import { eq, sql, and, like, or, asc, type SQL } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { TransactionContext } from "@flowcatalyst/persistence";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

import {
	processes,
	type ProcessRecord,
	type NewProcessRecord,
} from "../schema/index.js";
import type {
	Process,
	NewProcess,
	ProcessStatus,
	ProcessSource,
} from "../../../domain/index.js";

/**
 * Filters for process listing.
 */
export interface ProcessFilters {
	readonly application?: string | undefined;
	readonly subdomain?: string | undefined;
	readonly status?: ProcessStatus | undefined;
	readonly search?: string | undefined;
}

/**
 * Process repository interface.
 */
export interface ProcessRepository {
	findById(id: string, tx?: TransactionContext): Promise<Process | undefined>;
	findByCode(
		code: string,
		tx?: TransactionContext,
	): Promise<Process | undefined>;
	findAll(tx?: TransactionContext): Promise<Process[]>;
	findByApplication(
		application: string,
		tx?: TransactionContext,
	): Promise<Process[]>;
	findWithFilters(
		filters: ProcessFilters,
		tx?: TransactionContext,
	): Promise<Process[]>;
	existsByCode(code: string, tx?: TransactionContext): Promise<boolean>;
	exists(id: string, tx?: TransactionContext): Promise<boolean>;
	count(tx?: TransactionContext): Promise<number>;
	insert(entity: NewProcess, tx?: TransactionContext): Promise<Process>;
	update(entity: Process, tx?: TransactionContext): Promise<Process>;
	persist(entity: NewProcess, tx?: TransactionContext): Promise<Process>;
	deleteById(id: string, tx?: TransactionContext): Promise<boolean>;
	delete(entity: Process, tx?: TransactionContext): Promise<boolean>;
}

/**
 * Create a Process repository.
 */
export function createProcessRepository(defaultDb: AnyDb): ProcessRepository {
	const db = (tx?: TransactionContext): AnyDb => (tx?.db as AnyDb) ?? defaultDb;

	const repo: ProcessRepository = {
		async findById(
			id: string,
			tx?: TransactionContext,
		): Promise<Process | undefined> {
			const [record] = await db(tx)
				.select()
				.from(processes)
				.where(eq(processes.id, id))
				.limit(1);
			if (!record) return undefined;
			return recordToEntity(record);
		},

		async findByCode(
			code: string,
			tx?: TransactionContext,
		): Promise<Process | undefined> {
			const [record] = await db(tx)
				.select()
				.from(processes)
				.where(eq(processes.code, code))
				.limit(1);
			if (!record) return undefined;
			return recordToEntity(record);
		},

		async findAll(tx?: TransactionContext): Promise<Process[]> {
			const records = await db(tx)
				.select()
				.from(processes)
				.orderBy(asc(processes.code));
			return records.map(recordToEntity);
		},

		async findByApplication(
			application: string,
			tx?: TransactionContext,
		): Promise<Process[]> {
			const records = await db(tx)
				.select()
				.from(processes)
				.where(eq(processes.application, application))
				.orderBy(asc(processes.code));
			return records.map(recordToEntity);
		},

		async findWithFilters(
			filters: ProcessFilters,
			tx?: TransactionContext,
		): Promise<Process[]> {
			const conditions: SQL[] = [];
			if (filters.application !== undefined) {
				conditions.push(eq(processes.application, filters.application));
			}
			if (filters.subdomain !== undefined) {
				conditions.push(eq(processes.subdomain, filters.subdomain));
			}
			if (filters.status !== undefined) {
				conditions.push(eq(processes.status, filters.status));
			}
			if (filters.search !== undefined && filters.search.trim() !== "") {
				const pattern = `%${filters.search}%`;
				const codeLike = like(processes.code, pattern);
				const nameLike = like(processes.name, pattern);
				const combined = or(codeLike, nameLike);
				if (combined) conditions.push(combined);
			}

			let query = db(tx).select().from(processes).$dynamic();
			if (conditions.length > 0) {
				query = query.where(and(...conditions));
			}
			const records = await query.orderBy(asc(processes.code));
			return records.map(recordToEntity);
		},

		async existsByCode(
			code: string,
			tx?: TransactionContext,
		): Promise<boolean> {
			const [result] = await db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(processes)
				.where(eq(processes.code, code));
			return Number(result?.count ?? 0) > 0;
		},

		async exists(id: string, tx?: TransactionContext): Promise<boolean> {
			const [result] = await db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(processes)
				.where(eq(processes.id, id));
			return Number(result?.count ?? 0) > 0;
		},

		async count(tx?: TransactionContext): Promise<number> {
			const [result] = await db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(processes);
			return Number(result?.count ?? 0);
		},

		async insert(
			entity: NewProcess,
			tx?: TransactionContext,
		): Promise<Process> {
			const now = new Date();
			const record: NewProcessRecord = {
				id: entity.id,
				code: entity.code,
				name: entity.name,
				description: entity.description,
				status: entity.status,
				source: entity.source,
				application: entity.application,
				subdomain: entity.subdomain,
				processName: entity.processName,
				body: entity.body,
				diagramType: entity.diagramType,
				tags: entity.tags,
				createdAt: entity.createdAt ?? now,
				updatedAt: entity.updatedAt ?? now,
			};
			await db(tx).insert(processes).values(record);
			return repo.findById(entity.id, tx) as Promise<Process>;
		},

		async update(
			entity: Process,
			tx?: TransactionContext,
		): Promise<Process> {
			const now = new Date();
			await db(tx)
				.update(processes)
				.set({
					code: entity.code,
					name: entity.name,
					description: entity.description,
					status: entity.status,
					source: entity.source,
					application: entity.application,
					subdomain: entity.subdomain,
					processName: entity.processName,
					body: entity.body,
					diagramType: entity.diagramType,
					tags: entity.tags,
					updatedAt: now,
				})
				.where(eq(processes.id, entity.id));
			return repo.findById(entity.id, tx) as Promise<Process>;
		},

		async persist(
			entity: NewProcess,
			tx?: TransactionContext,
		): Promise<Process> {
			const existed = await repo.exists(entity.id, tx);
			if (existed) {
				return repo.update(entity as Process, tx);
			}
			return repo.insert(entity, tx);
		},

		async deleteById(id: string, tx?: TransactionContext): Promise<boolean> {
			const existed = await repo.exists(id, tx);
			if (!existed) return false;
			await db(tx).delete(processes).where(eq(processes.id, id));
			return true;
		},

		async delete(
			entity: Process,
			tx?: TransactionContext,
		): Promise<boolean> {
			return repo.deleteById(entity.id, tx);
		},
	};

	return repo;
}

function recordToEntity(record: ProcessRecord): Process {
	return {
		id: record.id,
		code: record.code,
		name: record.name,
		description: record.description,
		status: record.status as ProcessStatus,
		source: record.source as ProcessSource,
		application: record.application,
		subdomain: record.subdomain,
		processName: record.processName,
		body: record.body,
		diagramType: record.diagramType,
		tags: record.tags,
		createdAt: record.createdAt,
		updatedAt: record.updatedAt,
	};
}