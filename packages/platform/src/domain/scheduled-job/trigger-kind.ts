/**
 * Trigger reason for a single firing.
 */
export const TriggerKind = {
	CRON: "CRON",
	MANUAL: "MANUAL",
} as const;

export type TriggerKind = (typeof TriggerKind)[keyof typeof TriggerKind];

export function parseTriggerKind(s: string): TriggerKind {
	return s === "MANUAL" ? "MANUAL" : "CRON";
}
