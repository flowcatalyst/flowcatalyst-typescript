/**
 * Sync Dispatch Pools Command
 */

import type { Command } from "@flowcatalyst/application";

export interface SyncPoolItem {
	readonly code: string;
	readonly name: string;
	readonly description?: string | null | undefined;
	/** Optional. `undefined` / `null` = concurrency-only. */
	readonly rateLimit?: number | null | undefined;
	readonly concurrency?: number | undefined;
}

export interface SyncDispatchPoolsCommand extends Command {
	readonly applicationCode: string;
	readonly pools: SyncPoolItem[];
	readonly removeUnlisted: boolean;
}
