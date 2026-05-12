import type { Command } from "@flowcatalyst/application";

export interface UpdateScheduledJobCommand extends Command {
	readonly scheduledJobId: string;
	readonly name?: string | undefined;
	readonly description?: string | null | undefined;
	readonly crons?: readonly string[] | undefined;
	readonly timezone?: string | undefined;
	readonly payload?: unknown | null | undefined;
	readonly concurrent?: boolean | undefined;
	readonly tracksCompletion?: boolean | undefined;
	readonly timeoutSeconds?: number | null | undefined;
	readonly deliveryMaxAttempts?: number | undefined;
	readonly targetUrl?: string | null | undefined;
}
