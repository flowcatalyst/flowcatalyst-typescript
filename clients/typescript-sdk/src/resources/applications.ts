/**
 * Applications Resource
 *
 * Manage applications in the platform.
 */

import type { ResultAsync } from "neverthrow";
import type { SdkError } from "../errors";
import type { FlowCatalystClient } from "../client";
import * as sdk from "../generated/sdk.gen";
import type {
	GetApiApplicationsResponse,
	GetApiApplicationsByIdResponse,
	PostApiApplicationsData,
	PutApiApplicationsByIdData,
	PostApiApplicationsByIdProvisionServiceAccountResponse,
} from "../generated/types.gen";

export type ApplicationListResponse = GetApiApplicationsResponse;
export type ApplicationResponse = GetApiApplicationsByIdResponse;
export type CreateApplicationRequest = PostApiApplicationsData["body"];
export type UpdateApplicationRequest = PutApiApplicationsByIdData["body"];
export type CreateServiceAccountResponse =
	PostApiApplicationsByIdProvisionServiceAccountResponse;

/**
 * Applications resource for managing platform applications.
 */
export class ApplicationsResource {
	private readonly client: FlowCatalystClient;

	constructor(client: FlowCatalystClient) {
		this.client = client;
	}

	/**
	 * List all applications.
	 */
	list(): ResultAsync<ApplicationListResponse, SdkError> {
		return this.client.request<ApplicationListResponse>((httpClient, headers) =>
			sdk.getApiApplications({
				client: httpClient,
				headers,
			}),
		);
	}

	/**
	 * Get an application by ID.
	 */
	get(id: string): ResultAsync<ApplicationResponse, SdkError> {
		return this.client.request<ApplicationResponse>((httpClient, headers) =>
			sdk.getApiApplicationsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Get an application by code.
	 */
	getByCode(code: string): ResultAsync<ApplicationResponse, SdkError> {
		return this.client.request<ApplicationResponse>((httpClient, headers) =>
			sdk.getApiApplicationsByCodeByCode({
				client: httpClient,
				headers,
				path: { code },
			}),
		);
	}

	/**
	 * Create a new application.
	 */
	create(
		data: CreateApplicationRequest,
	): ResultAsync<ApplicationResponse, SdkError> {
		return this.client.request<ApplicationResponse>((httpClient, headers) =>
			sdk.postApiApplications({
				client: httpClient,
				headers,
				body: data,
			}),
		);
	}

	/**
	 * Update an application.
	 */
	update(
		id: string,
		data: UpdateApplicationRequest,
	): ResultAsync<ApplicationResponse, SdkError> {
		return this.client.request<ApplicationResponse>((httpClient, headers) =>
			sdk.putApiApplicationsById({
				client: httpClient,
				headers,
				path: { id },
				body: data,
			}),
		);
	}

	/**
	 * Delete an application.
	 */
	delete(id: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiApplicationsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Activate an application.
	 */
	activate(id: string): ResultAsync<ApplicationResponse, SdkError> {
		return this.client.request<ApplicationResponse>((httpClient, headers) =>
			sdk.postApiApplicationsByIdActivate({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Deactivate an application.
	 */
	deactivate(id: string): ResultAsync<ApplicationResponse, SdkError> {
		return this.client.request<ApplicationResponse>((httpClient, headers) =>
			sdk.postApiApplicationsByIdDeactivate({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Provision a service account for an application.
	 */
	provisionServiceAccount(
		id: string,
	): ResultAsync<CreateServiceAccountResponse, SdkError> {
		return this.client.request<CreateServiceAccountResponse>(
			(httpClient, headers) =>
				sdk.postApiApplicationsByIdProvisionServiceAccount({
					client: httpClient,
					headers,
					path: { id },
					body: {},
				}),
		);
	}
}
