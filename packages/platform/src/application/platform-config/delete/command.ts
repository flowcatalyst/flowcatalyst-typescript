/**
 * Delete Platform Config Command.
 */

import type { Command } from "@flowcatalyst/application";
import type { ConfigScope } from "../../../domain/config/platform-config.js";

export interface DeletePlatformConfigCommand extends Command {
	readonly applicationCode: string;
	readonly section: string;
	readonly property: string;
	readonly scope: ConfigScope;
	readonly clientId: string | null;
}
