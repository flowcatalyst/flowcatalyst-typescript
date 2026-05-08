/**
 * WebAuthn Credential Repository
 *
 * Stores public-key credentials registered by internal-auth users.
 * Federated users (those whose email domain has a row in
 * `email_domain_mapping`) never have rows here — gated at the
 * application layer in webauthn-gate.ts.
 */

import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { TransactionContext } from "@flowcatalyst/persistence";
import { generate } from "@flowcatalyst/tsid";
import {
	webauthnCredentials,
	type WebauthnCredentialRecord,
} from "../schema/index.js";
import type {
	WebauthnCredential,
	WebauthnCredentialData,
} from "../../../domain/webauthn/webauthn-credential.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

export interface WebauthnCredentialRepository {
	findByPrincipal(
		principalId: string,
		tx?: TransactionContext,
	): Promise<WebauthnCredential[]>;
	findByCredentialId(
		credentialIdBytes: Uint8Array,
		tx?: TransactionContext,
	): Promise<WebauthnCredential | undefined>;
	findById(
		id: string,
		tx?: TransactionContext,
	): Promise<WebauthnCredential | undefined>;
	persist(
		input: NewWebauthnCredentialInput,
		tx?: TransactionContext,
	): Promise<WebauthnCredential>;
	updateUsage(
		id: string,
		data: WebauthnCredentialData,
		lastUsedAt: Date,
		tx?: TransactionContext,
	): Promise<void>;
	deleteByIdForPrincipal(
		id: string,
		principalId: string,
		tx?: TransactionContext,
	): Promise<boolean>;
}

export interface NewWebauthnCredentialInput {
	readonly principalId: string;
	readonly credentialIdBytes: Uint8Array;
	readonly data: WebauthnCredentialData;
	readonly name: string | null;
}

export function createWebauthnCredentialRepository(
	defaultDb: AnyDb,
): WebauthnCredentialRepository {
	const db = (tx?: TransactionContext): AnyDb => (tx?.db as AnyDb) ?? defaultDb;

	return {
		async findByPrincipal(principalId, tx) {
			const rows = await db(tx)
				.select()
				.from(webauthnCredentials)
				.where(eq(webauthnCredentials.principalId, principalId));
			return rows.map(toCredential);
		},

		async findByCredentialId(credentialIdBytes, tx) {
			const [row] = await db(tx)
				.select()
				.from(webauthnCredentials)
				.where(eq(webauthnCredentials.credentialId, credentialIdBytes))
				.limit(1);
			return row ? toCredential(row) : undefined;
		},

		async findById(id, tx) {
			const [row] = await db(tx)
				.select()
				.from(webauthnCredentials)
				.where(eq(webauthnCredentials.id, id))
				.limit(1);
			return row ? toCredential(row) : undefined;
		},

		async persist(input, tx) {
			const id = generate("WEBAUTHN_CREDENTIAL");
			const now = new Date();
			const [row] = await db(tx)
				.insert(webauthnCredentials)
				.values({
					id,
					principalId: input.principalId,
					credentialId: input.credentialIdBytes,
					credentialData: input.data,
					name: input.name,
					createdAt: now,
					lastUsedAt: null,
				})
				.returning();
			if (!row) throw new Error("Failed to persist webauthn credential");
			return toCredential(row);
		},

		async updateUsage(id, data, lastUsedAt, tx) {
			await db(tx)
				.update(webauthnCredentials)
				.set({ credentialData: data, lastUsedAt })
				.where(eq(webauthnCredentials.id, id));
		},

		async deleteByIdForPrincipal(id, principalId, tx) {
			// Atomic ownership check: filter on both id AND principal_id so we
			// can never delete someone else's credential under a race.
			const rows = await db(tx)
				.delete(webauthnCredentials)
				.where(
					and(
						eq(webauthnCredentials.id, id),
						eq(webauthnCredentials.principalId, principalId),
					),
				)
				.returning({ id: webauthnCredentials.id });
			return rows.length > 0;
		},
	};
}

function toCredential(row: WebauthnCredentialRecord): WebauthnCredential {
	return {
		id: row.id,
		principalId: row.principalId,
		credentialIdBytes: new Uint8Array(row.credentialId),
		data: row.credentialData,
		name: row.name ?? null,
		createdAt: row.createdAt,
		lastUsedAt: row.lastUsedAt ?? null,
	};
}
