/**
 * Create Process Command
 */

import type { Command } from "@flowcatalyst/application";

export interface CreateProcessCommand extends Command {
	readonly code: string;
	readonly name: string;
	readonly description?: string | null;
	readonly body?: string;
	readonly diagramType?: string | null;
	readonly tags?: string[];
}
