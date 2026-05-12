/**
 * Lifecycle status of a single ScheduledJobInstance.
 *
 * Terminal states: COMPLETED, FAILED, DELIVERY_FAILED.
 * When the parent job's tracks_completion is false, DELIVERED is terminal too.
 */
export const InstanceStatus = {
	QUEUED: "QUEUED",
	IN_FLIGHT: "IN_FLIGHT",
	DELIVERED: "DELIVERED",
	COMPLETED: "COMPLETED",
	FAILED: "FAILED",
	DELIVERY_FAILED: "DELIVERY_FAILED",
} as const;

export type InstanceStatus = (typeof InstanceStatus)[keyof typeof InstanceStatus];

export function parseInstanceStatus(s: string): InstanceStatus {
	switch (s) {
		case "IN_FLIGHT":
			return "IN_FLIGHT";
		case "DELIVERED":
			return "DELIVERED";
		case "COMPLETED":
			return "COMPLETED";
		case "FAILED":
			return "FAILED";
		case "DELIVERY_FAILED":
			return "DELIVERY_FAILED";
		default:
			return "QUEUED";
	}
}

export function isTerminalStatus(s: InstanceStatus): boolean {
	return s === "COMPLETED" || s === "FAILED" || s === "DELIVERY_FAILED";
}
