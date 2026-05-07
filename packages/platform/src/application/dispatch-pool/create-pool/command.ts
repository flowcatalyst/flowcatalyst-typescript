/**
 * Create Dispatch Pool Command
 */

import type { Command } from "@flowcatalyst/application";

export interface CreateDispatchPoolCommand extends Command {
	readonly code: string;
	readonly name: string;
	readonly description?: string | null | undefined;
	/** Optional. `undefined` / `null` = concurrency-only (no rate limiter). */
	readonly rateLimit?: number | null | undefined;
	readonly concurrency?: number | undefined;
	readonly clientId?: string | null | undefined;
}
