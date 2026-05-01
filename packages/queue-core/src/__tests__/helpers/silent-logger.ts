import { createLogger, type Logger } from "@flowcatalyst/logging";

/**
 * Logger configured at "fatal" level so info/warn/error from the code under
 * test stay out of the test output. Pool/mediator code never logs at fatal.
 */
export function createSilentLogger(): Logger {
	return createLogger({
		level: "fatal",
		serviceName: "test",
		pretty: false,
	});
}
