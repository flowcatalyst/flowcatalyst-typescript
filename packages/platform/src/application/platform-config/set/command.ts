/**
 * Set Platform Config Command (upsert by key).
 */

import type { Command } from "@flowcatalyst/application";
import type {
	ConfigScope,
	ConfigValueType,
} from "../../../domain/config/platform-config.js";

export interface SetPlatformConfigCommand extends Command {
	readonly applicationCode: string;
	readonly section: string;
	readonly property: string;
	readonly scope: ConfigScope;
	readonly clientId: string | null;
	readonly value: string;
	readonly valueType: ConfigValueType;
	readonly description: string | null;
}
