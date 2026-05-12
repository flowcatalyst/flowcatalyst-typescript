import type { Command } from "@flowcatalyst/application";

export interface CreateScheduledJobCommand extends Command {
	readonly clientId?: string | null | undefined;
	readonly code: string;
	readonly name: string;
	readonly description?: string | null | undefined;
	readonly crons: readonly string[];
	readonly timezone?: string | undefined;
	readonly payload?: unknown | null | undefined;
	readonly concurrent?: boolean | undefined;
	readonly tracksCompletion?: boolean | undefined;
	readonly timeoutSeconds?: number | null | undefined;
	readonly deliveryMaxAttempts?: number | undefined;
	readonly targetUrl?: string | null | undefined;
}
