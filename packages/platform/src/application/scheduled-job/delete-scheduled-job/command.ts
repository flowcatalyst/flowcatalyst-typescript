import type { Command } from "@flowcatalyst/application";

export interface DeleteScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
}
