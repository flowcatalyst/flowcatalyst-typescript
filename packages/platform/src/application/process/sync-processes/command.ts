/**
 * Sync Processes Command
 */

import type { Command } from "@flowcatalyst/application";

export interface SyncProcessItem {
	readonly code: string;
	readonly name: string;
	readonly description?: string | null;
	readonly body?: string;
	readonly diagramType?: string;
	readonly tags?: string[];
}

export interface SyncProcessesCommand extends Command {
	readonly applicationCode: string;
	readonly processes: SyncProcessItem[];
	readonly removeUnlisted?: boolean;
}
