/**
 * Regenerate Auth Token Command
 */

import type { Command } from "@flowcatalyst/application";

/**
 * Command to rotate a service account's webhook auth token.
 *
 * If `customToken` is omitted the use case generates a fresh random token
 * (the regenerate flow). If supplied, the caller-provided value is encrypted
 * and stored — used by the admin "set custom token" endpoint. Either way the
 * same `AuthTokenRegenerated` event + audit log is emitted.
 */
export interface RegenerateAuthTokenCommand extends Command {
	/** Principal ID of the service account */
	readonly serviceAccountId: string;
	/** Optional caller-supplied token. When omitted, a random one is generated. */
	readonly customToken?: string | undefined;
}
