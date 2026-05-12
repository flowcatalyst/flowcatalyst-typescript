/**
 * SDK-reported completion outcome.
 */
export const CompletionStatus = {
	SUCCESS: "SUCCESS",
	FAILURE: "FAILURE",
} as const;

export type CompletionStatus =
	(typeof CompletionStatus)[keyof typeof CompletionStatus];

export function parseCompletionStatus(
	s: string | null | undefined,
): CompletionStatus | null {
	if (s === "SUCCESS") return "SUCCESS";
	if (s === "FAILURE") return "FAILURE";
	return null;
}
