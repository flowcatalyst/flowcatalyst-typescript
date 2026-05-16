/**
 * Update Process Command
 */

import type { Command } from "@flowcatalyst/application";

export interface UpdateProcessCommand extends Command {
	readonly processId: string;
	readonly name?: string;
	readonly description?: string | null;
	readonly body?: string;
	readonly diagramType?: string;
	readonly tags?: string[];
}
