/**
 * Create User Command
 *
 * Input data for creating a new user.
 */

import type { Command } from "@flowcatalyst/application";

/**
 * Command to create a new user.
 */
export interface CreateUserCommand extends Command {
	/** User's email address (will determine anchor user status) */
	readonly email: string;

	/** Plain text password (will be hashed) - required for INTERNAL auth */
	readonly password: string | null;

	/** User's display name */
	readonly name: string;

	/** Home client ID (nullable, will be auto-detected from email domain if not provided) */
	readonly clientId: string | null;

	/**
	 * When false, the platform skips its password complexity rules
	 * (uppercase/lowercase/digit/special) and only enforces a 2-character
	 * minimum. Intended for SDK callers that apply their own policy.
	 * Defaults to true.
	 */
	readonly enforcePasswordComplexity?: boolean | null;
}
