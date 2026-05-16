/**
 * Process Source
 *
 * Indicates how a process was created:
 * - CODE: Platform-defined processes
 * - API: Created via SDK/API sync
 * - UI: Created via admin UI
 */

export type ProcessSource = "CODE" | "API" | "UI";

export const ProcessSource = {
	CODE: "CODE" as const,
	API: "API" as const,
	UI: "UI" as const,
} as const;
