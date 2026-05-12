/**
 * Lifecycle status of a ScheduledJob definition.
 */
export const ScheduledJobStatus = {
	ACTIVE: "ACTIVE",
	PAUSED: "PAUSED",
	ARCHIVED: "ARCHIVED",
} as const;

export type ScheduledJobStatus =
	(typeof ScheduledJobStatus)[keyof typeof ScheduledJobStatus];

export function parseScheduledJobStatus(s: string): ScheduledJobStatus {
	if (s === "PAUSED") return "PAUSED";
	if (s === "ARCHIVED") return "ARCHIVED";
	return "ACTIVE";
}
