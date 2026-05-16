/**
 * Delete Process Command
 */

import type { Command } from "@flowcatalyst/application";

export interface DeleteProcessCommand extends Command {
	readonly processId: string;
}
