/**
 * Update Client Applications Command
 *
 * Replace the set of applications enabled for a client. Apps in the list
 * become enabled; previously enabled apps not in the list become disabled.
 */

import type { Command } from "@flowcatalyst/application";

export interface UpdateClientApplicationsCommand extends Command {
	readonly clientId: string;
	readonly enabledApplicationIds: string[];
}
