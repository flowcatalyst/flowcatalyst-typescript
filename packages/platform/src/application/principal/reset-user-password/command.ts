/**
 * Reset User Password Command
 */

import type { Command } from "@flowcatalyst/application";

export interface ResetUserPasswordCommand extends Command {
	readonly userId: string;
	/** New plaintext password. Hashed inside the use case. */
	readonly newPassword: string;
	/** When `false`, skip the platform's complexity rules. Defaults to `true`. */
	readonly enforcePasswordComplexity?: boolean;
}
