/**
 * Grant Platform Config Access Command
 */

import type { Command } from "@flowcatalyst/application";

export interface GrantPlatformConfigAccessCommand extends Command {
	readonly applicationCode: string;
	readonly roleCode: string;
	readonly canRead?: boolean;
	readonly canWrite?: boolean;
}
