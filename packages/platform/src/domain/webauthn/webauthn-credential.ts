/**
 * Domain shape of a registered WebAuthn credential. Mirrors the
 * persisted record but stays storage-agnostic (no Drizzle types).
 */
import type { WebauthnCredentialData } from "../../infrastructure/persistence/schema/webauthn-credentials.js";

export interface WebauthnCredential {
	readonly id: string;
	readonly principalId: string;
	readonly credentialIdBytes: Uint8Array;
	readonly data: WebauthnCredentialData;
	readonly name: string | null;
	readonly createdAt: Date;
	readonly lastUsedAt: Date | null;
}

export type { WebauthnCredentialData };
