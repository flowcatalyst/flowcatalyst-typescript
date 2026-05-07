/**
 * Deactivate OAuth Client Command
 */

import type { Command } from "@flowcatalyst/application";

export interface DeactivateOAuthClientCommand extends Command {
	readonly oauthClientId: string;
}
