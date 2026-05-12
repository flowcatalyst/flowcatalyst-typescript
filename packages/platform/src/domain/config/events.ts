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

// -----------------------------------------------------------------------------
// PlatformConfigSet — emitted on PUT (covers create + update; service is upsert)
// -----------------------------------------------------------------------------

export interface PlatformConfigSetData {
	readonly configId: string;
	readonly applicationCode: string;
	readonly section: string;
	readonly property: string;
	readonly scope: string;
	readonly clientId: string | null;
	readonly valueType: string;
	/** True if a new row was created; false if an existing row was updated. */
	readonly wasCreated: boolean;
	readonly [key: string]: unknown;
}

export class PlatformConfigSet extends BaseDomainEvent<PlatformConfigSetData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"platform-config",
		"set",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: PlatformConfigSetData) {
		super(
			{
				eventType: PlatformConfigSet.EVENT_TYPE,
				specVersion: PlatformConfigSet.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "platform-config", data.configId),
				messageGroup: DomainEvent.messageGroup(
					APP,
					"platform-config",
					data.applicationCode,
				),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// PlatformConfigDeleted — emitted on DELETE
// -----------------------------------------------------------------------------

export interface PlatformConfigDeletedData {
	readonly applicationCode: string;
	readonly section: string;
	readonly property: string;
	readonly scope: string;
	readonly clientId: string | null;
	readonly [key: string]: unknown;
}

export class PlatformConfigDeleted extends BaseDomainEvent<PlatformConfigDeletedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"platform-config",
		"deleted",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: PlatformConfigDeletedData) {
		super(
			{
				eventType: PlatformConfigDeleted.EVENT_TYPE,
				specVersion: PlatformConfigDeleted.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(
					APP,
					"platform-config",
					`${data.applicationCode}:${data.section}:${data.property}`,
				),
				messageGroup: DomainEvent.messageGroup(
					APP,
					"platform-config",
					data.applicationCode,
				),
			},
			ctx,
			data,
		);
	}
}
