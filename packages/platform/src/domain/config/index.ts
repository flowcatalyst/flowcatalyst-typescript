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
} from "./events.js";
