/**
 * Archive Process Command
 */

import type { Command } from "@flowcatalyst/application";

export interface ArchiveProcessCommand extends Command {
	readonly processId: string;
}
