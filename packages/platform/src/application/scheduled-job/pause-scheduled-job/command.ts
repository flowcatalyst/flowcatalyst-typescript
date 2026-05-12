import type { Command } from "@flowcatalyst/application";

export interface PauseScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
}
