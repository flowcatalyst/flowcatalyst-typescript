/**
 * Config Domain
 */

export * from "./platform-config.js";
export * from "./platform-config-access.js";
export * from "./platform-config-service.js";
export {
	type PlatformConfigAccessGrantedData,
	PlatformConfigAccessGranted,
	type PlatformConfigAccessUpdatedData,
	PlatformConfigAccessUpdated,
	type PlatformConfigAccessRevokedData,
	PlatformConfigAccessRevoked,
	type PlatformConfigSetData,
	PlatformConfigSet,
	type PlatformConfigDeletedData,
	PlatformConfigDeleted,
} from "./events.js";
