/**
 * Process Domain Events
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
// ProcessCreated
// -----------------------------------------------------------------------------

export interface ProcessCreatedData {
	readonly processId: string;
	readonly code: string;
	readonly name: string;
	readonly description: string | null;
	readonly application: string;
	readonly subdomain: string;
	readonly processName: string;
	readonly [key: string]: unknown;
}

export class ProcessCreated extends BaseDomainEvent<ProcessCreatedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"process",
		"created",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ProcessCreatedData) {
		super(
			{
				eventType: ProcessCreated.EVENT_TYPE,
				specVersion: ProcessCreated.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "process", data.processId),
				messageGroup: DomainEvent.messageGroup(APP, "process", data.processId),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// ProcessUpdated
// -----------------------------------------------------------------------------

export interface ProcessUpdatedData {
	readonly processId: string;
	readonly name: string | null;
	readonly description: string | null;
	readonly bodyChanged: boolean;
	readonly tags: string[] | null;
	readonly [key: string]: unknown;
}

export class ProcessUpdated extends BaseDomainEvent<ProcessUpdatedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"process",
		"updated",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ProcessUpdatedData) {
		super(
			{
				eventType: ProcessUpdated.EVENT_TYPE,
				specVersion: ProcessUpdated.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "process", data.processId),
				messageGroup: DomainEvent.messageGroup(APP, "process", data.processId),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// ProcessArchived
// -----------------------------------------------------------------------------

export interface ProcessArchivedData {
	readonly processId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ProcessArchived extends BaseDomainEvent<ProcessArchivedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"process",
		"archived",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ProcessArchivedData) {
		super(
			{
				eventType: ProcessArchived.EVENT_TYPE,
				specVersion: ProcessArchived.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "process", data.processId),
				messageGroup: DomainEvent.messageGroup(APP, "process", data.processId),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// ProcessDeleted
// -----------------------------------------------------------------------------

export interface ProcessDeletedData {
	readonly processId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ProcessDeleted extends BaseDomainEvent<ProcessDeletedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"process",
		"deleted",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ProcessDeletedData) {
		super(
			{
				eventType: ProcessDeleted.EVENT_TYPE,
				specVersion: ProcessDeleted.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "process", data.processId),
				messageGroup: DomainEvent.messageGroup(APP, "process", data.processId),
			},
			ctx,
			data,
		);
	}
}

// -----------------------------------------------------------------------------
// ProcessesSynced
// -----------------------------------------------------------------------------

export interface ProcessesSyncedData {
	readonly applicationCode: string;
	readonly processesCreated: number;
	readonly processesUpdated: number;
	readonly processesDeleted: number;
	readonly syncedProcessCodes: string[];
	readonly [key: string]: unknown;
}

export class ProcessesSynced extends BaseDomainEvent<ProcessesSyncedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"process",
		"synced",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ProcessesSyncedData) {
		super(
			{
				eventType: ProcessesSynced.EVENT_TYPE,
				specVersion: ProcessesSynced.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "process", data.applicationCode),
				messageGroup: DomainEvent.messageGroup(
					APP,
					"process",
					data.applicationCode,
				),
			},
			ctx,
			data,
		);
	}
}
