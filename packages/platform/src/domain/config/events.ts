/**
 * Platform Config Access Domain Events
 *
 * Events emitted when grant rows for platform config access are created,
 * updated, or revoked.
 */

import {
	BaseDomainEvent,
	DomainEvent,
	type ExecutionContext,
} from "@flowcatalyst/domain";

const APP = "platform";
const DOMAIN = "admin";
const SOURCE = `${APP}:${DOMAIN}`;

// -----------------------------------------------------------------------------
// PlatformConfigAccessGranted
// -----------------------------------------------------------------------------

export interface PlatformConfigAccessGrantedData {
	readonly grantId: string;
	readonly applicationCode: string;
	readonly roleCode: string;
	readonly canRead: boolean;
	readonly canWrite: boolean;
	readonly [key: string]: unknown;
}

export class PlatformConfigAccessGranted extends BaseDomainEvent<PlatformConfigAccessGrantedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"config-access",
		"granted",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: PlatformConfigAccessGrantedData) {
		super(
			{
				eventType: PlatformConfigAccessGranted.EVENT_TYPE,
				specVersion: PlatformConfigAccessGranted.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "config-access", data.grantId),
				messageGroup: DomainEvent.messageGroup(
					APP,
					"config-access",
					data.applicationCode,
				),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// PlatformConfigAccessUpdated
// -----------------------------------------------------------------------------

export interface PlatformConfigAccessUpdatedData {
	readonly grantId: string;
	readonly applicationCode: string;
	readonly roleCode: string;
	readonly canRead: boolean;
	readonly canWrite: boolean;
	readonly [key: string]: unknown;
}

export class PlatformConfigAccessUpdated extends BaseDomainEvent<PlatformConfigAccessUpdatedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"config-access",
		"updated",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: PlatformConfigAccessUpdatedData) {
		super(
			{
				eventType: PlatformConfigAccessUpdated.EVENT_TYPE,
				specVersion: PlatformConfigAccessUpdated.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "config-access", data.grantId),
				messageGroup: DomainEvent.messageGroup(
					APP,
					"config-access",
					data.applicationCode,
				),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// PlatformConfigAccessRevoked
// -----------------------------------------------------------------------------

export interface PlatformConfigAccessRevokedData {
	readonly applicationCode: string;
	readonly roleCode: string;
	readonly [key: string]: unknown;
}

export class PlatformConfigAccessRevoked extends BaseDomainEvent<PlatformConfigAccessRevokedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"config-access",
		"revoked",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: PlatformConfigAccessRevokedData) {
		super(
			{
				eventType: PlatformConfigAccessRevoked.EVENT_TYPE,
				specVersion: PlatformConfigAccessRevoked.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(
					APP,
					"config-access",
					`${data.applicationCode}:${data.roleCode}`,
				),
				messageGroup: DomainEvent.messageGroup(
					APP,
					"config-access",
					data.applicationCode,
				),
			},
			ctx,
			data,
		);
	}
}
