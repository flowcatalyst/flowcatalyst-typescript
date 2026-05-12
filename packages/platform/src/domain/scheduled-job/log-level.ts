/**
 * Log severity for ScheduledJobInstanceLog entries.
 */
export const LogLevel = {
	DEBUG: "DEBUG",
	INFO: "INFO",
	WARN: "WARN",
	ERROR: "ERROR",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export function parseLogLevel(s: string): LogLevel {
	switch (s) {
		case "DEBUG":
			return "DEBUG";
		case "WARN":
			return "WARN";
		case "ERROR":
			return "ERROR";
		default:
			return "INFO";
	}
}
