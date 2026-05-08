/**
 * Login Attempt Repository
 *
 * Data access for LoginAttempt entities.
 */

import { eq, asc, desc, sql, and, gte, lte } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { TransactionContext } from "@flowcatalyst/persistence";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

import { loginAttempts, type LoginAttemptRecord } from "../schema/index.js";
import type {
	LoginAttempt,
	LoginAttemptType,
	LoginOutcome,
	LoginFailureReason,
} from "../../../domain/index.js";
import { generate } from "@flowcatalyst/tsid";

/**
 * Pagination options.
 */
export interface LoginAttemptPaginationOptions {
	readonly page: number;
	readonly pageSize: number;
	readonly sortField?: string | undefined;
	readonly sortOrder?: string | undefined;
}

/**
 * Filter options for login attempt queries.
 */
export interface LoginAttemptFilters {
	readonly attemptType?: LoginAttemptType | undefined;
	readonly outcome?: LoginOutcome | undefined;
	readonly identifier?: string | undefined;
	readonly principalId?: string | undefined;
	readonly dateFrom?: Date | undefined;
	readonly dateTo?: Date | undefined;
}

/**
 * Paginated login attempt result.
 *
 * No `total` — `iam_login_attempts` grows unbounded and `count(*)`
 * gets expensive. Uses the "fetch pageSize + 1" pattern: ask for one
 * more row, drop the surplus, and return `hasMore` so the UI can
 * render a next-page affordance without knowing the absolute total.
 */
export interface PaginatedLoginAttempts {
	readonly items: LoginAttempt[];
	readonly hasMore: boolean;
	readonly page: number;
	readonly pageSize: number;
}

/**
 * Per-(email, ip) failure context for exponential-backoff rate limiting.
 * - failureCount counts FAILUREs since the most recent SUCCESS (or all-time
 *   FAILUREs if never successful).
 * - lastFailureAt is the timestamp of the most recent FAILURE (null if none).
 */
export interface EmailIpFailureContext {
	readonly failureCount: number;
	readonly lastFailureAt: Date | null;
}

/**
 * Login attempt repository interface.
 */
export interface LoginAttemptRepository {
	create(
		attempt: Omit<LoginAttempt, "id">,
		tx?: TransactionContext,
	): Promise<LoginAttempt>;
	findPaged(
		filters: LoginAttemptFilters,
		pagination: LoginAttemptPaginationOptions,
		tx?: TransactionContext,
	): Promise<PaginatedLoginAttempts>;
	/**
	 * Count FAILURE attempts for an identifier since the given timestamp.
	 * Used by the per-email global lockout (layer C).
	 */
	countFailuresByIdentifierSince(
		identifier: string,
		since: Date,
		tx?: TransactionContext,
	): Promise<number>;
	/**
	 * Get the failure context for an (identifier, ip) pair: number of
	 * consecutive FAILUREs since the most recent SUCCESS, plus the
	 * timestamp of the most recent FAILURE. Used by the per-(email, ip)
	 * exponential backoff (layer A).
	 */
	getIdentifierIpFailureContext(
		identifier: string,
		ipAddress: string | null,
		tx?: TransactionContext,
	): Promise<EmailIpFailureContext>;
}

/**
 * Create a LoginAttempt repository.
 */
export function createLoginAttemptRepository(
	defaultDb: AnyDb,
): LoginAttemptRepository {
	const db = (tx?: TransactionContext): AnyDb => (tx?.db as AnyDb) ?? defaultDb;

	return {
		async create(
			attempt: Omit<LoginAttempt, "id">,
			tx?: TransactionContext,
		): Promise<LoginAttempt> {
			const id = generate("LOGIN_ATTEMPT");

			const [record] = await db(tx)
				.insert(loginAttempts)
				.values({
					id,
					attemptType: attempt.attemptType,
					outcome: attempt.outcome,
					failureReason: attempt.failureReason ?? undefined,
					identifier: attempt.identifier,
					principalId: attempt.principalId ?? undefined,
					ipAddress: attempt.ipAddress ?? undefined,
					userAgent: attempt.userAgent ?? undefined,
					attemptedAt: attempt.attemptedAt,
				})
				.returning();

			return recordToLoginAttempt(record!);
		},

		async countFailuresByIdentifierSince(
			identifier: string,
			since: Date,
			tx?: TransactionContext,
		): Promise<number> {
			const rows = await db(tx)
				.select({ count: sql<number>`count(*)` })
				.from(loginAttempts)
				.where(
					and(
						eq(loginAttempts.identifier, identifier),
						eq(loginAttempts.outcome, "FAILURE"),
						gte(loginAttempts.attemptedAt, since),
					),
				);
			return Number(rows[0]?.count ?? 0);
		},

		async getIdentifierIpFailureContext(
			identifier: string,
			ipAddress: string | null,
			tx?: TransactionContext,
		): Promise<EmailIpFailureContext> {
			// Pull the recent attempts for (identifier, ip), most-recent-first,
			// and walk forward stopping at the first SUCCESS. The 50-row LIMIT
			// is a safety bound for absurd histories — far beyond any realistic
			// backoff threshold.
			const ipFilter =
				ipAddress === null
					? sql`${loginAttempts.ipAddress} IS NULL`
					: eq(loginAttempts.ipAddress, ipAddress);
			const rows = await db(tx)
				.select({
					outcome: loginAttempts.outcome,
					attemptedAt: loginAttempts.attemptedAt,
				})
				.from(loginAttempts)
				.where(and(eq(loginAttempts.identifier, identifier), ipFilter))
				.orderBy(desc(loginAttempts.attemptedAt))
				.limit(50);

			let failureCount = 0;
			let lastFailureAt: Date | null = null;
			for (const row of rows) {
				if (row.outcome === "SUCCESS") break;
				if (row.outcome === "FAILURE") {
					if (lastFailureAt === null) lastFailureAt = row.attemptedAt;
					failureCount++;
				}
			}
			return { failureCount, lastFailureAt };
		},

		async findPaged(
			filters: LoginAttemptFilters,
			pagination: LoginAttemptPaginationOptions,
			tx?: TransactionContext,
		): Promise<PaginatedLoginAttempts> {
			const conditions = [];

			if (filters.attemptType) {
				conditions.push(eq(loginAttempts.attemptType, filters.attemptType));
			}
			if (filters.outcome) {
				conditions.push(eq(loginAttempts.outcome, filters.outcome));
			}
			if (filters.identifier) {
				conditions.push(eq(loginAttempts.identifier, filters.identifier));
			}
			if (filters.principalId) {
				conditions.push(eq(loginAttempts.principalId, filters.principalId));
			}
			if (filters.dateFrom) {
				conditions.push(gte(loginAttempts.attemptedAt, filters.dateFrom));
			}
			if (filters.dateTo) {
				conditions.push(lte(loginAttempts.attemptedAt, filters.dateTo));
			}

			const whereClause =
				conditions.length > 0 ? and(...conditions) : undefined;

			const limit = pagination.pageSize;
			const offset = pagination.page * pagination.pageSize;

			const sortFn = pagination.sortOrder === "asc" ? asc : desc;
			const sortCol =
				pagination.sortField === "attemptType"
					? loginAttempts.attemptType
					: pagination.sortField === "outcome"
						? loginAttempts.outcome
						: pagination.sortField === "identifier"
							? loginAttempts.identifier
							: loginAttempts.attemptedAt;

			// Fetch pageSize + 1 rows. If we get the extra, there's another page.
			// Avoids count(*) against the unbounded iam_login_attempts table.
			const records = await (whereClause
				? db(tx)
						.select()
						.from(loginAttempts)
						.where(whereClause)
						.orderBy(sortFn(sortCol))
						.limit(limit + 1)
						.offset(offset)
				: db(tx)
						.select()
						.from(loginAttempts)
						.orderBy(sortFn(sortCol))
						.limit(limit + 1)
						.offset(offset));

			const hasMore = records.length > limit;
			const trimmed = hasMore ? records.slice(0, limit) : records;

			return {
				items: trimmed.map(recordToLoginAttempt),
				hasMore,
				page: pagination.page,
				pageSize: pagination.pageSize,
			};
		},
	};
}

/**
 * Convert a database record to a LoginAttempt domain object.
 */
function recordToLoginAttempt(record: LoginAttemptRecord): LoginAttempt {
	return {
		id: record.id,
		attemptType: record.attemptType as LoginAttemptType,
		outcome: record.outcome as LoginOutcome,
		failureReason: (record.failureReason as LoginFailureReason) ?? null,
		identifier: record.identifier ?? "",
		principalId: record.principalId ?? null,
		ipAddress: record.ipAddress ?? null,
		userAgent: record.userAgent ?? null,
		attemptedAt: record.attemptedAt,
	};
}
