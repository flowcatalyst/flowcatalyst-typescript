/**
 * ScheduledJob Domain Events
 *
 * Emitted when scheduled job definitions change. Instance lifecycle
 * transitions (QUEUED → IN_FLIGHT → DELIVERED → ...) bypass the UoW and
 * do NOT emit events — they're high-volume infrastructure transitions.
 */

import {
	BaseDomainEvent,
	DomainEvent,
	type ExecutionContext,
} from "@flowcatalyst/domain";

const APP = "platform";
const DOMAIN = "scheduled-job";
const SOURCE = `${APP}:${DOMAIN}`;

function subject(id: string): string {
	return DomainEvent.subject(APP, "scheduled-job", id);
}
function group(id: string): string {
	return DomainEvent.messageGroup(APP, "scheduled-job", id);
}

// ─── Created ────────────────────────────────────────────────────────────────
export interface ScheduledJobCreatedData {
	readonly scheduledJobId: string;
	readonly clientId: string | null;
	readonly code: string;
	readonly name: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobCreated extends BaseDomainEvent<ScheduledJobCreatedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"created",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobCreatedData) {
		super(
			{
				eventType: ScheduledJobCreated.EVENT_TYPE,
				specVersion: ScheduledJobCreated.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Updated ────────────────────────────────────────────────────────────────
export interface ScheduledJobUpdatedData {
	readonly scheduledJobId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobUpdated extends BaseDomainEvent<ScheduledJobUpdatedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"updated",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobUpdatedData) {
		super(
			{
				eventType: ScheduledJobUpdated.EVENT_TYPE,
				specVersion: ScheduledJobUpdated.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Paused ─────────────────────────────────────────────────────────────────
export interface ScheduledJobPausedData {
	readonly scheduledJobId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobPaused extends BaseDomainEvent<ScheduledJobPausedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"paused",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobPausedData) {
		super(
			{
				eventType: ScheduledJobPaused.EVENT_TYPE,
				specVersion: ScheduledJobPaused.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Resumed ────────────────────────────────────────────────────────────────
export interface ScheduledJobResumedData {
	readonly scheduledJobId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobResumed extends BaseDomainEvent<ScheduledJobResumedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"resumed",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobResumedData) {
		super(
			{
				eventType: ScheduledJobResumed.EVENT_TYPE,
				specVersion: ScheduledJobResumed.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Archived ───────────────────────────────────────────────────────────────
export interface ScheduledJobArchivedData {
	readonly scheduledJobId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobArchived extends BaseDomainEvent<ScheduledJobArchivedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"archived",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobArchivedData) {
		super(
			{
				eventType: ScheduledJobArchived.EVENT_TYPE,
				specVersion: ScheduledJobArchived.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Deleted ────────────────────────────────────────────────────────────────
export interface ScheduledJobDeletedData {
	readonly scheduledJobId: string;
	readonly code: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobDeleted extends BaseDomainEvent<ScheduledJobDeletedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"deleted",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobDeletedData) {
		super(
			{
				eventType: ScheduledJobDeleted.EVENT_TYPE,
				specVersion: ScheduledJobDeleted.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Fired (manual) ─────────────────────────────────────────────────────────
export interface ScheduledJobFiredData {
	readonly scheduledJobId: string;
	readonly code: string;
	readonly instanceId: string;
	readonly [key: string]: unknown;
}

export class ScheduledJobFired extends BaseDomainEvent<ScheduledJobFiredData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"fired",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobFiredData) {
		super(
			{
				eventType: ScheduledJobFired.EVENT_TYPE,
				specVersion: ScheduledJobFired.SPEC_VERSION,
				source: SOURCE,
				subject: subject(data.scheduledJobId),
				messageGroup: group(data.scheduledJobId),
			},
			ctx,
			data,
		);
	}
}

// ─── Sync ───────────────────────────────────────────────────────────────────
export interface ScheduledJobsSyncedData {
	readonly clientId: string | null;
	readonly synced: number;
	readonly created: number;
	readonly updated: number;
	readonly archived: number;
	readonly [key: string]: unknown;
}

export class ScheduledJobsSynced extends BaseDomainEvent<ScheduledJobsSyncedData> {
	static readonly EVENT_TYPE = DomainEvent.eventType(
		APP,
		DOMAIN,
		"scheduled-job",
		"synced",
	);
	static readonly SPEC_VERSION = "1.0";

	constructor(ctx: ExecutionContext, data: ScheduledJobsSyncedData) {
		super(
			{
				eventType: ScheduledJobsSynced.EVENT_TYPE,
				specVersion: ScheduledJobsSynced.SPEC_VERSION,
				source: SOURCE,
				subject: DomainEvent.subject(APP, "scheduled-job", "sync"),
				messageGroup: DomainEvent.messageGroup(APP, "scheduled-job", "sync"),
			},
			ctx,
			data,
		);
	}
}
