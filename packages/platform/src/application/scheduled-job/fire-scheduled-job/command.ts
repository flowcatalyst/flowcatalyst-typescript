import type { Command } from "@flowcatalyst/application";

export interface FireScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
	/** Optional correlation id stamped on the resulting instance for tracing. */
	readonly correlationId?: string | null | undefined;
}
