/**
 * Dispatch Pools Resource
 *
 * Manage dispatch pools for rate limiting and concurrency control.
 */

import type { ResultAsync } from "neverthrow";
import type { SdkError } from "../errors";
import type { FlowCatalystClient } from "../client";
import * as sdk from "../generated/sdk.gen";
import type {
	GetApiDispatchPoolsResponse,
	GetApiDispatchPoolsByIdResponse,
	PostApiDispatchPoolsData,
	PutApiDispatchPoolsByIdData,
	PostApiDispatchPoolsSyncData,
	PostApiDispatchPoolsSyncResponse,
} from "../generated/types.gen";

export type DispatchPoolListResponse = GetApiDispatchPoolsResponse;
export type DispatchPoolDto = GetApiDispatchPoolsByIdResponse;
export type CreateDispatchPoolRequest = PostApiDispatchPoolsData["body"];
export type UpdateDispatchPoolRequest =
	PutApiDispatchPoolsByIdData["body"];
export type SyncDispatchPoolsResponse = PostApiDispatchPoolsSyncResponse;

export interface DispatchPoolFilters {
	clientId?: string;
	status?: string;
}

/**
 * Dispatch Pools resource for managing rate limiting and concurrency.
 */
export class DispatchPoolsResource {
	private readonly client: FlowCatalystClient;

	constructor(client: FlowCatalystClient) {
		this.client = client;
	}

	/**
	 * List all dispatch pools with optional filters.
	 */
	list(
		filters?: DispatchPoolFilters,
	): ResultAsync<DispatchPoolListResponse, SdkError> {
		return this.client.request<DispatchPoolListResponse>(
			(httpClient, headers) =>
				sdk.getApiDispatchPools({
					client: httpClient,
					headers,
					query: filters,
				}),
		);
	}

	/**
	 * Get a dispatch pool by ID.
	 */
	get(id: string): ResultAsync<DispatchPoolDto, SdkError> {
		return this.client.request<DispatchPoolDto>((httpClient, headers) =>
			sdk.getApiDispatchPoolsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Create a new dispatch pool.
	 */
	create(
		data: CreateDispatchPoolRequest,
	): ResultAsync<DispatchPoolDto, SdkError> {
		return this.client.request<DispatchPoolDto>((httpClient, headers) =>
			sdk.postApiDispatchPools({
				client: httpClient,
				headers,
				body: data,
			}),
		);
	}

	/**
	 * Update a dispatch pool.
	 */
	update(
		id: string,
		data: UpdateDispatchPoolRequest,
	): ResultAsync<DispatchPoolDto, SdkError> {
		return this.client.request<DispatchPoolDto>((httpClient, headers) =>
			sdk.putApiDispatchPoolsById({
				client: httpClient,
				headers,
				path: { id },
				body: data,
			}),
		);
	}

	/**
	 * Delete (archive) a dispatch pool.
	 */
	delete(id: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiDispatchPoolsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Suspend a dispatch pool.
	 */
	suspend(id: string): ResultAsync<DispatchPoolDto, SdkError> {
		return this.client.request<DispatchPoolDto>((httpClient, headers) =>
			sdk.postApiDispatchPoolsByIdSuspend({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Activate a dispatch pool.
	 */
	activate(id: string): ResultAsync<DispatchPoolDto, SdkError> {
		return this.client.request<DispatchPoolDto>((httpClient, headers) =>
			sdk.postApiDispatchPoolsByIdActivate({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Sync dispatch pools for an application.
	 */
	sync(
		applicationCode: string,
		pools: PostApiDispatchPoolsSyncData["body"]["pools"],
		removeUnlisted = false,
	): ResultAsync<SyncDispatchPoolsResponse, SdkError> {
		return this.client.request<SyncDispatchPoolsResponse>(
			(httpClient, headers) =>
				sdk.postApiDispatchPoolsSync({
					client: httpClient,
					headers,
					body: { applicationCode, pools, removeUnlisted },
				}),
		);
	}
}
