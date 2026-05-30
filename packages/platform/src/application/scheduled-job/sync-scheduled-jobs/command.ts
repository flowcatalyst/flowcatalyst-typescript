import type { Command } from "@flowcatalyst/application";

export interface SyncScheduledJobItem {
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

export interface SyncScheduledJobsCommand extends Command {
	/**
	 * Tenant scope. Null = platform-scoped sync; set = client-scoped sync.
	 */
	readonly clientId: string | null;
	readonly scheduledJobs: readonly SyncScheduledJobItem[];
	/**
	 * When true, ACTIVE jobs in this scope whose code is absent from
	 * `scheduledJobs` are archived. Defaults to false (additive sync).
	 */
	readonly archiveUnlisted?: boolean | undefined;
}
