import type { Command } from "@flowcatalyst/application";

export interface ArchiveScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
}
