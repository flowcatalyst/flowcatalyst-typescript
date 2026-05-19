/**
 * Principals Resource
 *
 * Manage users and service accounts.
 */

import type { ResultAsync } from "neverthrow";
import type { SdkError } from "../errors";
import type { FlowCatalystClient } from "../client";
import * as sdk from "../generated/sdk.gen";
import type {
	GetApiPrincipalsResponse,
	GetApiPrincipalsByIdResponse,
	PostApiPrincipalsUsersData,
	PutApiPrincipalsByIdData,
	GetApiPrincipalsByIdRolesResponse,
	GetApiPrincipalsByIdClientAccessResponse,
} from "../generated/types.gen";

export type PrincipalListResponse = GetApiPrincipalsResponse;
export type PrincipalDto = GetApiPrincipalsByIdResponse;
export type CreateUserRequest = PostApiPrincipalsUsersData["body"];
export type UpdatePrincipalRequest = PutApiPrincipalsByIdData["body"];
export type RoleListResponse = GetApiPrincipalsByIdRolesResponse;
export type ClientAccessListResponse =
	GetApiPrincipalsByIdClientAccessResponse;

export interface PrincipalFilters {
	clientId?: string;
	type?: string;
	active?: string;
	email?: string;
}

/**
 * Principals resource for managing users and service accounts.
 */
export class PrincipalsResource {
	private readonly client: FlowCatalystClient;

	constructor(client: FlowCatalystClient) {
		this.client = client;
	}

	/**
	 * List all principals with optional filters.
	 */
	list(
		filters?: PrincipalFilters,
	): ResultAsync<PrincipalListResponse, SdkError> {
		return this.client.request<PrincipalListResponse>((httpClient, headers) =>
			sdk.getApiPrincipals({
				client: httpClient,
				headers,
				query: filters,
			}),
		);
	}

	/**
	 * Get a principal by ID.
	 */
	get(id: string): ResultAsync<PrincipalDto, SdkError> {
		return this.client.request<PrincipalDto>((httpClient, headers) =>
			sdk.getApiPrincipalsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Find a user by email.
	 *
	 * Client-side filters the response to rows whose email matches exactly
	 * (case-insensitive). Older platform builds silently ignored unknown
	 * query parameters and returned an unfiltered list; we defend against
	 * that here so callers don't act on the wrong principal.
	 */
	findByEmail(email: string): ResultAsync<PrincipalListResponse, SdkError> {
		const needle = email.toLowerCase();
		return this.list({ email }).map((response) => {
			const principals = response.principals.filter(
				(p) => (p.email ?? "").toLowerCase() === needle,
			);
			return { principals, total: principals.length };
		});
	}

	/**
	 * Create a new user principal.
	 */
	createUser(data: CreateUserRequest): ResultAsync<PrincipalDto, SdkError> {
		return this.client.request<PrincipalDto>((httpClient, headers) =>
			sdk.postApiPrincipalsUsers({
				client: httpClient,
				headers,
				body: data,
			}),
		);
	}

	/**
	 * Update a principal.
	 */
	update(
		id: string,
		data: UpdatePrincipalRequest,
	): ResultAsync<PrincipalDto, SdkError> {
		return this.client.request<PrincipalDto>((httpClient, headers) =>
			sdk.putApiPrincipalsById({
				client: httpClient,
				headers,
				path: { id },
				body: data,
			}),
		);
	}

	/**
	 * Activate a principal.
	 */
	activate(id: string): ResultAsync<PrincipalDto, SdkError> {
		return this.client.request<PrincipalDto>((httpClient, headers) =>
			sdk.postApiPrincipalsByIdActivate({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Deactivate a principal.
	 */
	deactivate(id: string): ResultAsync<PrincipalDto, SdkError> {
		return this.client.request<PrincipalDto>((httpClient, headers) =>
			sdk.postApiPrincipalsByIdDeactivate({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Get roles assigned to a principal.
	 */
	getRoles(id: string): ResultAsync<RoleListResponse, SdkError> {
		return this.client.request<RoleListResponse>((httpClient, headers) =>
			sdk.getApiPrincipalsByIdRoles({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/**
	 * Assign a single role to a principal.
	 */
	assignRole(id: string, roleName: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.postApiPrincipalsByIdRoles({
				client: httpClient,
				headers,
				path: { id },
				body: { roleName },
			}),
		);
	}

	/**
	 * Remove a role from a principal.
	 */
	removeRole(id: string, roleName: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiPrincipalsByIdRolesByRole({
				client: httpClient,
				headers,
				path: { id, role: roleName },
			}),
		);
	}

	/**
	 * Assign roles to a principal (declarative - replaces all roles).
	 */
	assignRoles(id: string, roles: string[]): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.putApiPrincipalsByIdRoles({
				client: httpClient,
				headers,
				path: { id },
				body: { roles },
			}),
		);
	}

	/**
	 * Get client access grants for a principal.
	 */
	getClientAccessGrants(
		id: string,
	): ResultAsync<ClientAccessListResponse, SdkError> {
		return this.client.request<ClientAccessListResponse>(
			(httpClient, headers) =>
				sdk.getApiPrincipalsByIdClientAccess({
					client: httpClient,
					headers,
					path: { id },
				}),
		);
	}

	/**
	 * Grant client access to a principal.
	 */
	grantClientAccess(
		id: string,
		clientId: string,
	): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.postApiPrincipalsByIdClientAccess({
				client: httpClient,
				headers,
				path: { id },
				body: { clientId },
			}),
		);
	}

	/**
	 * Revoke client access from a principal.
	 */
	revokeClientAccess(
		id: string,
		clientId: string,
	): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiPrincipalsByIdClientAccessByClientId({
				client: httpClient,
				headers,
				path: { id, clientId },
			}),
		);
	}
}
