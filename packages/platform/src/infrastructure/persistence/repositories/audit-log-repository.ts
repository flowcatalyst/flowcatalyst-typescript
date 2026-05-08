/**
 * Audit Log Repository
 *
 * Data access for AuditLog entities.
 */

import { eq, asc, desc, and, inArray, isNotNull } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { TransactionContext } from "@flowcatalyst/persistence";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

import { auditLogs, type AuditLogRecord } from "../schema/index.js";
import type { AuditLog } from "../../../domain/index.js";

/**
 * Pagination options.
 */
export interface PaginationOptions {
	readonly limit: number;
	readonly offset: number;
	readonly sortField?: string | undefined;
	readonly sortOrder?: string | undefined;
}

/**
 * Filter options for audit log queries.
 */
export interface AuditLogFilters {
	readonly entityType?: string | undefined;
	readonly entityId?: string | undefined;
	readonly principalId?: string | undefined;
	readonly operation?: string | undefined;
	readonly applicationIds?: string[] | undefined;
	readonly clientIds?: string[] | undefined;
}

/**
 * Paginated audit log result.
 *
 * No `total` — `aud_logs` grows unbounded and `count(*)` against it gets
 * expensive even with indexes. We use the "fetch limit + 1" pattern:
 * ask for one more row than requested, drop the surplus, and return
 * `hasMore` so the UI can render a next-page affordance without
 * knowing the absolute total.
 */
export interface PaginatedAuditLogs {
	readonly logs: AuditLog[];
	readonly hasMore: boolean;
	readonly limit: number;
	readonly offset: number;
}

/**
 * Audit log repository interface.
 */
export interface AuditLogRepository {
	findById(id: string, tx?: TransactionContext): Promise<AuditLog | undefined>;
	findByEntity(
		entityType: string,
		entityId: string,
		pagination: PaginationOptions,
		tx?: TransactionContext,
	): Promise<PaginatedAuditLogs>;
	findByPrincipal(
		principalId: string,
		pagination: PaginationOptions,
		tx?: TransactionContext,
	): Promise<PaginatedAuditLogs>;
	findByOperation(
		operation: string,
		pagination: PaginationOptions,
		tx?: TransactionContext,
	): Promise<PaginatedAuditLogs>;
	findPaged(
		filters: AuditLogFilters,
		pagination: PaginationOptions,
		tx?: TransactionContext,
	): Promise<PaginatedAuditLogs>;
	findDistinctEntityTypes(tx?: TransactionContext): Promise<string[]>;
	findDistinctOperations(tx?: TransactionContext): Promise<string[]>;
	findDistinctApplicationIds(tx?: TransactionContext): Promise<string[]>;
	findDistinctClientIds(tx?: TransactionContext): Promise<string[]>;
}

/**
 * Create an AuditLog repository.
 */
export function createAuditLogRepository(defaultDb: AnyDb): AuditLogRepository {
	const db = (tx?: TransactionContext): AnyDb => (tx?.db as AnyDb) ?? defaultDb;

	return {
		async findById(
			id: string,
			tx?: TransactionContext,
		): Promise<AuditLog | undefined> {
			const [record] = await db(tx)
				.select()
				.from(auditLogs)
				.where(eq(auditLogs.id, id))
				.limit(1);

			if (!record) return undefined;

			return recordToAuditLog(record);
		},

		async findByEntity(
			entityType: string,
			entityId: string,
			pagination: PaginationOptions,
			tx?: TransactionContext,
		): Promise<PaginatedAuditLogs> {
			return await fetchPaged(
				db(tx),
				and(
					eq(auditLogs.entityType, entityType),
					eq(auditLogs.entityId, entityId),
				),
				desc(auditLogs.performedAt),
				pagination,
			);
		},

		async findByPrincipal(
			principalId: string,
			pagination: PaginationOptions,
			tx?: TransactionContext,
		): Promise<PaginatedAuditLogs> {
			return await fetchPaged(
				db(tx),
				eq(auditLogs.principalId, principalId),
				desc(auditLogs.performedAt),
				pagination,
			);
		},

		async findByOperation(
			operation: string,
			pagination: PaginationOptions,
			tx?: TransactionContext,
		): Promise<PaginatedAuditLogs> {
			return await fetchPaged(
				db(tx),
				eq(auditLogs.operation, operation),
				desc(auditLogs.performedAt),
				pagination,
			);
		},

		async findPaged(
			filters: AuditLogFilters,
			pagination: PaginationOptions,
			tx?: TransactionContext,
		): Promise<PaginatedAuditLogs> {
			// Build conditions dynamically
			const conditions = [];

			if (filters.entityType) {
				conditions.push(eq(auditLogs.entityType, filters.entityType));
			}
			if (filters.entityId) {
				conditions.push(eq(auditLogs.entityId, filters.entityId));
			}
			if (filters.principalId) {
				conditions.push(eq(auditLogs.principalId, filters.principalId));
			}
			if (filters.operation) {
				conditions.push(eq(auditLogs.operation, filters.operation));
			}
			if (filters.applicationIds && filters.applicationIds.length > 0) {
				conditions.push(inArray(auditLogs.applicationId, filters.applicationIds));
			}
			if (filters.clientIds && filters.clientIds.length > 0) {
				conditions.push(inArray(auditLogs.clientId, filters.clientIds));
			}

			const whereClause =
				conditions.length > 0 ? and(...conditions) : undefined;

			const sortFn = pagination.sortOrder === "asc" ? asc : desc;
			const sortCol =
				pagination.sortField === "entityType"
					? auditLogs.entityType
					: pagination.sortField === "operation"
						? auditLogs.operation
						: auditLogs.performedAt;

			return await fetchPaged(db(tx), whereClause, sortFn(sortCol), pagination);
		},

		async findDistinctEntityTypes(tx?: TransactionContext): Promise<string[]> {
			const results = await db(tx)
				.selectDistinct({ entityType: auditLogs.entityType })
				.from(auditLogs)
				.orderBy(auditLogs.entityType);

			return results.map((r) => r.entityType);
		},

		async findDistinctOperations(tx?: TransactionContext): Promise<string[]> {
			const results = await db(tx)
				.selectDistinct({ operation: auditLogs.operation })
				.from(auditLogs)
				.orderBy(auditLogs.operation);

			return results.map((r) => r.operation);
		},

		async findDistinctApplicationIds(tx?: TransactionContext): Promise<string[]> {
			const results = await db(tx)
				.selectDistinct({ applicationId: auditLogs.applicationId })
				.from(auditLogs)
				.where(isNotNull(auditLogs.applicationId))
				.orderBy(auditLogs.applicationId);

			return results.map((r) => r.applicationId!);
		},

		async findDistinctClientIds(tx?: TransactionContext): Promise<string[]> {
			const results = await db(tx)
				.selectDistinct({ clientId: auditLogs.clientId })
				.from(auditLogs)
				.where(isNotNull(auditLogs.clientId))
				.orderBy(auditLogs.clientId);

			return results.map((r) => r.clientId!);
		},

	};
}

/**
 * Shared "fetch limit + 1" helper for the paginated audit-log queries.
 * Avoids count(*) against the unbounded aud_logs table — the surplus
 * row is dropped from items and surfaced as `hasMore`.
 */
async function fetchPaged(
	db: AnyDb,
	whereClause: ReturnType<typeof and> | undefined,
	orderByExpr: ReturnType<typeof asc>,
	pagination: PaginationOptions,
): Promise<PaginatedAuditLogs> {
	const limit = pagination.limit;
	const records = await (whereClause
		? db
				.select()
				.from(auditLogs)
				.where(whereClause)
				.orderBy(orderByExpr)
				.limit(limit + 1)
				.offset(pagination.offset)
		: db
				.select()
				.from(auditLogs)
				.orderBy(orderByExpr)
				.limit(limit + 1)
				.offset(pagination.offset));
	const hasMore = records.length > limit;
	const trimmed = hasMore ? records.slice(0, limit) : records;
	return {
		logs: trimmed.map(recordToAuditLog),
		hasMore,
		limit,
		offset: pagination.offset,
	};
}

/**
 * Convert a database record to an AuditLog.
 */
function recordToAuditLog(record: AuditLogRecord): AuditLog {
	return {
		id: record.id,
		entityType: record.entityType,
		entityId: record.entityId,
		operation: record.operation,
		operationJson: record.operationJson,
		principalId: record.principalId,
		applicationId: record.applicationId ?? null,
		clientId: record.clientId ?? null,
		performedAt: record.performedAt,
	};
}
