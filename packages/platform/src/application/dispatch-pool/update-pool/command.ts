/**
 * Update Dispatch Pool Command
 */

import type { Command } from "@flowcatalyst/application";
import type { DispatchPoolStatus } from "../../../domain/index.js";

export interface UpdateDispatchPoolCommand extends Command {
	readonly poolId: string;
	readonly name?: string | undefined;
	readonly description?: string | null | undefined;
	/** `undefined` = leave unchanged. `null` = clear (concurrency-only). */
	readonly rateLimit?: number | null | undefined;
	readonly concurrency?: number | undefined;
	readonly status?: DispatchPoolStatus | undefined;
}
