/**
 * Activate OAuth Client Command
 */

import type { Command } from "@flowcatalyst/application";

export interface ActivateOAuthClientCommand extends Command {
	readonly oauthClientId: string;
}
