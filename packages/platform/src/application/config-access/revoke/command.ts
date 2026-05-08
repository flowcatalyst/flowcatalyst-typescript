/**
 * Revoke Platform Config Access Command
 */

import type { Command } from "@flowcatalyst/application";

export interface RevokePlatformConfigAccessCommand extends Command {
	readonly applicationCode: string;
	readonly roleCode: string;
}
