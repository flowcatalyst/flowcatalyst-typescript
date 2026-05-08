/**
 * WebAuthn Credentials Schema
 *
 * Stores public-key credentials registered by internal-auth users.
 * Federated users (those whose email domain has a row in
 * `email_domain_mapping`) never have rows here — gated at the
 * application layer in `webauthn-gate.ts`.
 *
 * All fields are non-secret by spec: the private key never leaves the
 * authenticator (Secure Enclave / TPM / YubiKey). No application-layer
 * encryption is applied.
 *
 * `credential_id` is denormalised out of `credential_data` so we can
 * index lookups at authentication time. The full @simplewebauthn payload
 * (public key, sign-count, transports, deviceType, backed-up flag) is
 * stored in `credential_data` and rewritten on each successful auth.
 */

import {
	pgTable,
	varchar,
	customType,
	jsonb,
	index,
} from "drizzle-orm/pg-core";
import { tsidColumn, timestampColumn } from "@flowcatalyst/persistence";

const bytea = customType<{ data: Uint8Array; driverData: Buffer }>({
	dataType() {
		return "bytea";
	},
	toDriver(v: Uint8Array): Buffer {
		return Buffer.from(v);
	},
	fromDriver(v: Buffer): Uint8Array {
		return new Uint8Array(v);
	},
});

export const webauthnCredentials = pgTable(
	"iam_webauthn_credentials",
	{
		id: tsidColumn("id").primaryKey(),
		principalId: varchar("principal_id", { length: 17 }).notNull(),
		credentialId: bytea("credential_id").notNull().unique(),
		credentialData: jsonb("credential_data")
			.$type<WebauthnCredentialData>()
			.notNull(),
		name: varchar("name", { length: 120 }),
		createdAt: timestampColumn("created_at").notNull().defaultNow(),
		lastUsedAt: timestampColumn("last_used_at"),
	},
	(table) => [
		index("idx_iam_webauthn_credentials_principal").on(table.principalId),
	],
);

/**
 * Persisted form of a registered passkey. Mirrors the shape returned by
 * @simplewebauthn/server's verifyRegistrationResponse, plus the running
 * sign-count and last-known backup state.
 */
export interface WebauthnCredentialData {
	/** Base64url-encoded credential ID (also denormalised to the bytea column). */
	readonly credentialID: string;
	/** Base64url-encoded COSE public key. */
	readonly credentialPublicKey: string;
	/** Sign-count from the latest successful auth. Monotonic per RFC 8809. */
	readonly counter: number;
	/** Reported transports — used to populate allowCredentials.transports. */
	readonly transports?: readonly string[];
	/** "singleDevice" | "multiDevice" — synced passkey vs. device-bound. */
	readonly deviceType?: string;
	/** Whether the credential is currently backed up (flag CB). */
	readonly backedUp?: boolean;
}

export type WebauthnCredentialRecord = typeof webauthnCredentials.$inferSelect;
export type NewWebauthnCredentialRecord =
	typeof webauthnCredentials.$inferInsert;
