/**
 * Event Read Repository
 *
 * Read-only data access for the events_read CQRS projection table.
 * Supports pagination, filtering, and cascading filter options.
 */

import { eq, asc, desc, and, inArray, gte, lte } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { TransactionContext } from "@flowcatalyst/persistence";
import { eventsRead, type EventReadRecord } from "@flowcatalyst/persistence";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

/**
 * Filter options for event read queries.
 */
export interface EventReadFilters {
	readonly clientIds?: string[] | undefined;
	readonly applications?: string[] | undefined;
	readonly subdomains?: string[] | undefined;
	readonly aggregates?: string[] | undefined;
	readonly types?: string[] | undefined;
	readonly source?: string | undefined;
	readonly subject?: string | undefined;
	readonly correlationId?: string | undefined;
	readonly messageGroup?: string | undefined;
	readonly timeAfter?: Date | undefined;
	readonly timeBefore?: Date | undefined;
}

/**
 * Pagination options.
 */
export interface EventReadPagination {
	readonly page: number;
	readonly size: number;
	readonly sortField?: string | undefined;
	readonly sortOrder?: string | undefined;
}

/**
 * Paged result.
 *
 * No `totalItems`/`totalPages` — `events_read` grows unbounded and
 * `count(*)` against it gets expensive even with indexes. We use the
 * "fetch size + 1" pattern: ask for one more row than requested, drop
 * the surplus, and return `hasMore` so the UI can render a next-page
 * affordance without knowing the absolute total.
 */
export interface PagedEventReadResult {
	readonly items: EventReadRecord[];
	readonly page: number;
	readonly size: number;
	readonly hasMore: boolean;
}

/**
 * Cascading filter option.
 */
export interface FilterOption {
	readonly value: string;
	readonly label: string;
}

/**
 * Filter options request (narrowing context for cascading filters).
 */
export interface EventFilterOptionsRequest {
	readonly clientIds?: string[] | undefined;
	readonly applications?: string[] | undefined;
	readonly subdomains?: string[] | undefined;
	readonly aggregates?: string[] | undefined;
}

/**
 * Available filter options.
 */
export interface EventFilterOptions {
	readonly applications: FilterOption[];
	readonly subdomains: FilterOption[];
	readonly aggregates: FilterOption[];
	readonly types: FilterOption[];
}

function toFilterOptions(results: { value: string | null }[]): FilterOption[] {
	return results
		.filter(
			(r): r is { value: string } =>
				r.value !== null && r.value.trim() !== "",
		)
		.map((r) => ({ value: r.value, label: r.value }))
		.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Event read repository interface.
 */
export interface EventReadRepository {
	findById(
		id: string,
		tx?: TransactionContext,
	): Promise<EventReadRecord | undefined>;
	findPaged(
		filters: EventReadFilters,
		pagination: EventReadPagination,
		tx?: TransactionContext,
	): Promise<PagedEventReadResult>;
	getFilterOptions(
		request: EventFilterOptionsRequest,
		tx?: TransactionContext,
	): Promise<EventFilterOptions>;
}

/**
 * Create an EventRead repository.
 */
export function createEventReadRepository(
	defaultDb: AnyDb,
): EventReadRepository {
	const db = (tx?: TransactionContext): AnyDb => (tx?.db as AnyDb) ?? defaultDb;

	function buildConditions(
		filters: EventReadFilters | EventFilterOptionsRequest,
	) {
		const conditions = [];

		if (
			"clientIds" in filters &&
			filters.clientIds &&
			filters.clientIds.length > 0
		) {
			conditions.push(inArray(eventsRead.clientId, filters.clientIds));
		}
		if (filters.applications && filters.applications.length > 0) {
			conditions.push(inArray(eventsRead.application, filters.applications));
		}
		if (filters.subdomains && filters.subdomains.length > 0) {
			conditions.push(inArray(eventsRead.subdomain, filters.subdomains));
		}
		if (filters.aggregates && filters.aggregates.length > 0) {
			conditions.push(inArray(eventsRead.aggregate, filters.aggregates));
		}
		if ("types" in filters && filters.types && filters.types.length > 0) {
			conditions.push(inArray(eventsRead.type, filters.types));
		}
		if ("source" in filters && filters.source) {
			conditions.push(eq(eventsRead.source, filters.source));
		}
		if ("subject" in filters && filters.subject) {
			conditions.push(eq(eventsRead.subject, filters.subject));
		}
		if ("correlationId" in filters && filters.correlationId) {
			conditions.push(eq(eventsRead.correlationId, filters.correlationId));
		}
		if ("messageGroup" in filters && filters.messageGroup) {
			conditions.push(eq(eventsRead.messageGroup, filters.messageGroup));
		}
		if ("timeAfter" in filters && filters.timeAfter) {
			conditions.push(gte(eventsRead.time, filters.timeAfter));
		}
		if ("timeBefore" in filters && filters.timeBefore) {
			conditions.push(lte(eventsRead.time, filters.timeBefore));
		}

		return conditions.length > 0 ? and(...conditions) : undefined;
	}

	return {
		async findById(
			id: string,
			tx?: TransactionContext,
		): Promise<EventReadRecord | undefined> {
			const [record] = await db(tx)
				.select()
				.from(eventsRead)
				.where(eq(eventsRead.id, id))
				.limit(1);

			return record;
		},

		async findPaged(
			filters: EventReadFilters,
			pagination: EventReadPagination,
			tx?: TransactionContext,
		): Promise<PagedEventReadResult> {
			const page = Math.max(pagination.page, 0);
			const size = Math.min(Math.max(pagination.size, 1), 500);
			const offset = page * size;
			const whereClause = buildConditions(filters);

			const sortFn = pagination.sortOrder === "asc" ? asc : desc;
			const sortCol = eventsRead.time;

			// Fetch size + 1 rows. If we get the extra, there's another page.
			// Avoids count(*) against the unbounded events_read table.
			const baseSelect = db(tx).select().from(eventsRead);
			const records = await (whereClause
				? baseSelect
						.where(whereClause)
						.orderBy(sortFn(sortCol))
						.limit(size + 1)
						.offset(offset)
				: baseSelect
						.orderBy(sortFn(sortCol))
						.limit(size + 1)
						.offset(offset));

			const hasMore = records.length > size;
			const items = hasMore ? records.slice(0, size) : records;

			return {
				items,
				page,
				size,
				hasMore,
			};
		},

		async getFilterOptions(
			request: EventFilterOptionsRequest,
			tx?: TransactionContext,
		): Promise<EventFilterOptions> {
			const whereClause = buildConditions(request);

			const queryDb = db(tx);

			const [appResults, subResults, aggResults, typeResults] =
				await Promise.all([
					whereClause
						? queryDb
								.selectDistinct({ value: eventsRead.application })
								.from(eventsRead)
								.where(whereClause)
						: queryDb
								.selectDistinct({ value: eventsRead.application })
								.from(eventsRead),
					whereClause
						? queryDb
								.selectDistinct({ value: eventsRead.subdomain })
								.from(eventsRead)
								.where(whereClause)
						: queryDb
								.selectDistinct({ value: eventsRead.subdomain })
								.from(eventsRead),
					whereClause
						? queryDb
								.selectDistinct({ value: eventsRead.aggregate })
								.from(eventsRead)
								.where(whereClause)
						: queryDb
								.selectDistinct({ value: eventsRead.aggregate })
								.from(eventsRead),
					whereClause
						? queryDb
								.selectDistinct({ value: eventsRead.type })
								.from(eventsRead)
								.where(whereClause)
						: queryDb
								.selectDistinct({ value: eventsRead.type })
								.from(eventsRead),
				]);

			return {
				applications: toFilterOptions(appResults),
				subdomains: toFilterOptions(subResults),
				aggregates: toFilterOptions(aggResults),
				types: toFilterOptions(typeResults),
			};
		},

	};
}
