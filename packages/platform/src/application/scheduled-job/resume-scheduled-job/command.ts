import type { Command } from "@flowcatalyst/application";

export interface ResumeScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
}
