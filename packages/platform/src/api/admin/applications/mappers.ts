/**
 * Entity-to-response mappers for the applications admin API.
 * Pure transformations — no I/O.
 */

import type {
	ApplicationResponse,
	ApplicationClientConfigResponse,
} from "./schemas.js";

export function toApplicationResponse(application: {
	id: string;
	type: string;
	code: string;
	name: string;
	description: string | null;
	iconUrl: string | null;
	website: string | null;
	logo: string | null;
	logoMimeType: string | null;
	defaultBaseUrl: string | null;
	serviceAccountId: string | null;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}): ApplicationResponse {
	return {
		id: application.id,
		type: application.type,
		code: application.code,
		name: application.name,
		description: application.description,
		iconUrl: application.iconUrl,
		website: application.website,
		logo: application.logo,
		logoMimeType: application.logoMimeType,
		defaultBaseUrl: application.defaultBaseUrl,
		serviceAccountId: application.serviceAccountId,
		active: application.active,
		createdAt: application.createdAt.toISOString(),
		updatedAt: application.updatedAt.toISOString(),
	};
}

export function toApplicationClientConfigResponse(config: {
	id: string;
	applicationId: string;
	clientId: string;
	enabled: boolean;
	createdAt: Date;
	updatedAt: Date;
}): ApplicationClientConfigResponse {
	return {
		id: config.id,
		applicationId: config.applicationId,
		clientId: config.clientId,
		enabled: config.enabled,
		createdAt: config.createdAt.toISOString(),
		updatedAt: config.updatedAt.toISOString(),
	};
}
