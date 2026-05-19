/**
 * Roles Resource
 *
 * Manage roles and permissions.
 */

import type { ResultAsync } from "neverthrow";
import type { SdkError } from "../errors";
import type { FlowCatalystClient } from "../client";
import * as sdk from "../generated/sdk.gen";
import type {
	GetApiRolesResponse,
	GetApiRolesByRoleNameResponse,
	PostApiRolesData,
	PutApiRolesByRoleNameData,
	GetApiRolesByApplicationByApplicationIdResponse,
} from "../generated/types.gen";

export type RoleListResponse = GetApiRolesResponse;
export type RoleDto = GetApiRolesByRoleNameResponse;
export type CreateRoleRequest = PostApiRolesData["body"];
export type UpdateRoleRequest = PutApiRolesByRoleNameData["body"];
export type RoleListByApplicationResponse =
	GetApiRolesByApplicationByApplicationIdResponse;

/**
 * Roles resource for managing role-based access control.
 */
export class RolesResource {
	private readonly client: FlowCatalystClient;

	constructor(client: FlowCatalystClient) {
		this.client = client;
	}

	/**
	 * List all roles.
	 */
	list(): ResultAsync<RoleListResponse, SdkError> {
		return this.client.request<RoleListResponse>((httpClient, headers) =>
			sdk.getApiRoles({
				client: httpClient,
				headers,
			}),
		);
	}

	/**
	 * Get a role by name.
	 */
	get(roleName: string): ResultAsync<RoleDto, SdkError> {
		return this.client.request<RoleDto>((httpClient, headers) =>
			sdk.getApiRolesByRoleName({
				client: httpClient,
				headers,
				path: { roleName },
			}),
		);
	}

	/**
	 * Create a new role.
	 */
	create(data: CreateRoleRequest): ResultAsync<RoleDto, SdkError> {
		return this.client.request<RoleDto>((httpClient, headers) =>
			sdk.postApiRoles({
				client: httpClient,
				headers,
				body: data,
			}),
		);
	}

	/**
	 * Update a role.
	 */
	update(
		roleName: string,
		data: UpdateRoleRequest,
	): ResultAsync<RoleDto, SdkError> {
		return this.client.request<RoleDto>((httpClient, headers) =>
			sdk.putApiRolesByRoleName({
				client: httpClient,
				headers,
				path: { roleName },
				body: data,
			}),
		);
	}

	/**
	 * Delete a role.
	 */
	delete(roleName: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiRolesByRoleName({
				client: httpClient,
				headers,
				path: { roleName },
			}),
		);
	}

	/**
	 * List roles for an application.
	 */
	listForApplication(
		applicationId: string,
	): ResultAsync<RoleListByApplicationResponse, SdkError> {
		return this.client.request<RoleListByApplicationResponse>(
			(httpClient, headers) =>
				sdk.getApiRolesByApplicationByApplicationId({
					client: httpClient,
					headers,
					path: { applicationId },
				}),
		);
	}
}
