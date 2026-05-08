/**
 * WebAuthn Ceremony State Repository
 *
 * Short-lived single-use challenge persistence. Stored in the existing
 * `oauth_oidc_payloads` table with type discriminants:
 *   - `WebauthnRegistration:{state_id}` — challenge + principalId (+ optional displayName)
 *   - `WebauthnAuthentication:{state_id}` — challenge + optional principalId
 *
 * `consume_*` uses `DELETE … RETURNING` so a successful read also marks
 * the state as used in a single round-trip — race-free and replay-safe.
 *
 * Choosing this table over a new schema avoids a migration; the ceremony
 * lifetime (default 600s) lines up well with how oidc-provider already
 * uses the table for ephemeral state. The `type` column carries our
 * discriminator so we don't accidentally collide with OIDC artifacts.
 */

import { and, eq, lt } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { oidcPayloads } from "../schema/oidc-payloads.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = PostgresJsDatabase<any>;

const REGISTRATION_TYPE = "WebauthnRegistration";
const AUTHENTICATION_TYPE = "WebauthnAuthentication";

const DEFAULT_TTL_SECS = 600;

interface RegistrationPayload {
	readonly principalId: string;
	readonly challenge: string;
	readonly displayName: string | null;
}

interface AuthenticationPayload {
	readonly principalId: string | null;
	readonly challenge: string;
	/** Base64url-encoded credential ids included in the challenge. */
	readonly allowCredentials: readonly string[];
}

export interface ConsumedRegistrationCeremony {
	readonly principalId: string;
	readonly challenge: string;
	readonly displayName: string | null;
}

export interface ConsumedAuthenticationCeremony {
	readonly principalId: string | null;
	readonly challenge: string;
	readonly allowCredentials: readonly string[];
}

export interface WebauthnCeremonyRepository {
	storeRegistration(input: {
		stateId: string;
		principalId: string;
		challenge: string;
		displayName: string | null;
	}): Promise<void>;
	consumeRegistration(
		stateId: string,
	): Promise<ConsumedRegistrationCeremony | undefined>;
	storeAuthentication(input: {
		stateId: string;
		principalId: string | null;
		challenge: string;
		allowCredentials: readonly string[];
	}): Promise<void>;
	consumeAuthentication(
		stateId: string,
	): Promise<ConsumedAuthenticationCeremony | undefined>;
	pruneExpired(): Promise<number>;
}

export function createWebauthnCeremonyRepository(
	defaultDb: AnyDb,
	ttlSeconds: number = DEFAULT_TTL_SECS,
): WebauthnCeremonyRepository {
	const ttlMs = ttlSeconds * 1_000;

	function expiresAt(now: Date): Date {
		return new Date(now.getTime() + ttlMs);
	}

	function makeId(kind: string, stateId: string): string {
		return `${kind}:${stateId}`;
	}

	return {
		async storeRegistration({ stateId, principalId, challenge, displayName }) {
			const now = new Date();
			const payload: RegistrationPayload = {
				principalId,
				challenge,
				displayName,
			};
			await defaultDb.insert(oidcPayloads).values({
				id: makeId(REGISTRATION_TYPE, stateId),
				type: REGISTRATION_TYPE,
				payload: payload as unknown as Record<string, unknown>,
				expiresAt: expiresAt(now),
				createdAt: now,
			});
		},

		async consumeRegistration(stateId) {
			const id = makeId(REGISTRATION_TYPE, stateId);
			const rows = await defaultDb
				.delete(oidcPayloads)
				.where(
					and(eq(oidcPayloads.id, id), eq(oidcPayloads.type, REGISTRATION_TYPE)),
				)
				.returning();
			const row = rows[0];
			if (!row) return undefined;
			if (row.expiresAt && row.expiresAt < new Date()) return undefined;
			const payload = row.payload as unknown as RegistrationPayload;
			return {
				principalId: payload.principalId,
				challenge: payload.challenge,
				displayName: payload.displayName ?? null,
			};
		},

		async storeAuthentication({
			stateId,
			principalId,
			challenge,
			allowCredentials,
		}) {
			const now = new Date();
			const payload: AuthenticationPayload = {
				principalId,
				challenge,
				allowCredentials,
			};
			await defaultDb.insert(oidcPayloads).values({
				id: makeId(AUTHENTICATION_TYPE, stateId),
				type: AUTHENTICATION_TYPE,
				payload: payload as unknown as Record<string, unknown>,
				expiresAt: expiresAt(now),
				createdAt: now,
			});
		},

		async consumeAuthentication(stateId) {
			const id = makeId(AUTHENTICATION_TYPE, stateId);
			const rows = await defaultDb
				.delete(oidcPayloads)
				.where(
					and(
						eq(oidcPayloads.id, id),
						eq(oidcPayloads.type, AUTHENTICATION_TYPE),
					),
				)
				.returning();
			const row = rows[0];
			if (!row) return undefined;
			if (row.expiresAt && row.expiresAt < new Date()) return undefined;
			const payload = row.payload as unknown as AuthenticationPayload;
			return {
				principalId: payload.principalId ?? null,
				challenge: payload.challenge,
				allowCredentials: payload.allowCredentials,
			};
		},

		async pruneExpired() {
			const rows = await defaultDb
				.delete(oidcPayloads)
				.where(lt(oidcPayloads.expiresAt, new Date()))
				.returning({ id: oidcPayloads.id });
			return rows.length;
		},
	};
}
