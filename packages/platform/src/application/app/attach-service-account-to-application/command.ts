/**
 * Attach Service Account to Application Command
 */

import type { Command } from "@flowcatalyst/application";

export interface AttachServiceAccountToApplicationCommand extends Command {
	readonly applicationId: string;
	readonly serviceAccountId: string;
	readonly serviceAccountCode: string;
}
