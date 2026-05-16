/**
 * Process Status
 */

export type ProcessStatus = "CURRENT" | "ARCHIVED";

export const ProcessStatus = {
	CURRENT: "CURRENT" as const,
	ARCHIVED: "ARCHIVED" as const,
} as const;
