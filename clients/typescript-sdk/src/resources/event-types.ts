/**
 * Event Types Resource
 *
 * Manage event type definitions and schemas.
 */

import type { ResultAsync } from "neverthrow";
import type { SdkError } from "../errors";
import type { FlowCatalystClient } from "../client";
import * as sdk from "../generated/sdk.gen";
import type {
	GetApiEventTypesResponse,
	GetApiEventTypesByIdResponse,
	PostApiEventTypesData,
	PatchApiEventTypesByIdData,
	PostApiEventTypesByIdSchemasData,
	PostApiEventTypesSyncData,
	PostApiEventTypesSyncResponse,
	GetApiEventTypesFiltersApplicationsResponse,
} from "../generated/types.gen";

export type EventTypeListResponse = GetApiEventTypesResponse;
export type EventTypeResponse = GetApiEventTypesByIdResponse;
export type CreateEventTypeRequest = PostApiEventTypesData["body"];
export type UpdateEventTypeRequest = PatchApiEventTypesByIdData["body"];
export type SyncEventTypesResponse = PostApiEventTypesSyncResponse;
export type FilterOptionsResponse =
	GetApiEventTypesFiltersApplicationsResponse;

export interface EventTypeFilters {
	status?: string;
	application?: string[];
	subdomain?: string[];
	aggregate?: string[];
}

/**
 * Event Types resource for managing event type definitions.
 */
export class EventTypesResource {
	private readonly client: FlowCatalystClient;

	constructor(client: FlowCatalystClient) {
		this.client = client;
	}

	/**
	 * List all event types with optional filters.
	 */
	list(
		filters?: EventTypeFilters,
	): ResultAsync<EventTypeListResponse, SdkError> {
		return this.client.request<EventTypeListResponse>((httpClient, headers) =>
			sdk.getApiEventTypes({
				client: httpClient,
				headers,
				query: filters,
			}),
		);
	}

	/**
	 * Get an event type by ID.
	 */
	get(id: string): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.getApiEventTypesById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Create a new event type.
	 */
	create(
		data: CreateEventTypeRequest,
	): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.postApiEventTypes({
				client: httpClient,
				headers,
				body: data,
			}),
		);
	}

	/**
	 * Update an event type.
	 */
	update(
		id: string,
		data: UpdateEventTypeRequest,
	): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.patchApiEventTypesById({
				client: httpClient,
				headers,
				path: { id },
				body: data,
			}),
		);
	}

	/**
	 * Add a schema version to an event type.
	 */
	addSchema(
		id: string,
		schema: PostApiEventTypesByIdSchemasData["body"],
	): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.postApiEventTypesByIdSchemas({
				client: httpClient,
				headers,
				path: { id },
				body: schema,
			}),
		);
	}

	/**
	 * Finalise a schema version (FINALISING -> CURRENT).
	 */
	finaliseSchema(
		id: string,
		version: string,
	): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.postApiEventTypesByIdSchemasByVersionFinalise({
				client: httpClient,
				headers,
				path: { id, version },
			}),
		);
	}

	/**
	 * Deprecate a schema version (CURRENT -> DEPRECATED).
	 */
	deprecateSchema(
		id: string,
		version: string,
	): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.postApiEventTypesByIdSchemasByVersionDeprecate({
				client: httpClient,
				headers,
				path: { id, version },
			}),
		);
	}

	/**
	 * Archive an event type.
	 */
	archive(id: string): ResultAsync<EventTypeResponse, SdkError> {
		return this.client.request<EventTypeResponse>((httpClient, headers) =>
			sdk.postApiEventTypesByIdArchive({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Delete an event type.
	 */
	delete(id: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiEventTypesById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Get distinct application names for filtering.
	 */
	filterApplications(): ResultAsync<FilterOptionsResponse, SdkError> {
		return this.client.request<FilterOptionsResponse>((httpClient, headers) =>
			sdk.getApiEventTypesFiltersApplications({
				client: httpClient,
				headers,
			}),
		);
	}

	/**
	 * Get distinct subdomains for filtering.
	 */
	filterSubdomains(
		application?: string[],
	): ResultAsync<FilterOptionsResponse, SdkError> {
		return this.client.request<FilterOptionsResponse>((httpClient, headers) =>
			sdk.getApiEventTypesFiltersSubdomains({
				client: httpClient,
				headers,
				query: { application },
			}),
		);
	}

	/**
	 * Get distinct aggregates for filtering.
	 */
	filterAggregates(
		application?: string[],
		subdomain?: string[],
	): ResultAsync<FilterOptionsResponse, SdkError> {
		return this.client.request<FilterOptionsResponse>((httpClient, headers) =>
			sdk.getApiEventTypesFiltersAggregates({
				client: httpClient,
				headers,
				query: { application, subdomain },
			}),
		);
	}

	/**
	 * Sync event types for an application.
	 */
	sync(
		applicationCode: string,
		eventTypes: PostApiEventTypesSyncData["body"]["eventTypes"],
		removeUnlisted = false,
	): ResultAsync<SyncEventTypesResponse, SdkError> {
		return this.client.request<SyncEventTypesResponse>((httpClient, headers) =>
			sdk.postApiEventTypesSync({
				client: httpClient,
				headers,
				body: { applicationCode, eventTypes, removeUnlisted },
			}),
		);
	}
}
