/**
 * Scheduled Jobs Resource
 *
 * Manage scheduled jobs and their instances. A `ScheduledJob` is a cron-driven
 * (or manually-fired) job definition that the platform fires into a webhook
 * target URL. Each firing produces a `ScheduledJobInstance` which the SDK
 * callback path can log against and mark complete.
 */

import type { ResultAsync } from "neverthrow";
import type { SdkError } from "../errors";
import type { FlowCatalystClient } from "../client";
import * as sdk from "../generated/sdk.gen";
import type {
	GetApiScheduledJobsResponse,
	GetApiScheduledJobsByIdResponse,
	PostApiScheduledJobsData,
	PostApiScheduledJobsResponse,
	PatchApiScheduledJobsByIdData,
	PatchApiScheduledJobsByIdResponse,
	PostApiScheduledJobsByIdPauseResponse,
	PostApiScheduledJobsByIdResumeResponse,
	PostApiScheduledJobsByIdArchiveResponse,
	PostApiScheduledJobsByIdFireData,
	PostApiScheduledJobsByIdFireResponse,
	PostApiScheduledJobsSyncData,
	PostApiScheduledJobsSyncResponse,
	GetApiScheduledJobsInstancesData,
	GetApiScheduledJobsInstancesResponse,
	GetApiScheduledJobsInstancesByInstanceIdResponse,
	GetApiScheduledJobsInstancesByInstanceIdLogsResponse,
	PostApiScheduledJobsInstancesByInstanceIdLogData,
	PostApiScheduledJobsInstancesByInstanceIdLogResponse,
	PostApiScheduledJobsInstancesByInstanceIdCompleteData,
	PostApiScheduledJobsInstancesByInstanceIdCompleteResponse,
} from "../generated/types.gen";

export type ScheduledJobListResponse = GetApiScheduledJobsResponse;
export type ScheduledJobResponse = GetApiScheduledJobsByIdResponse;
export type CreateScheduledJobRequest = PostApiScheduledJobsData["body"];
export type CreateScheduledJobResponse = PostApiScheduledJobsResponse;
export type UpdateScheduledJobRequest = PatchApiScheduledJobsByIdData["body"];
export type UpdateScheduledJobResponse = PatchApiScheduledJobsByIdResponse;
export type FireScheduledJobRequest = PostApiScheduledJobsByIdFireData["body"];
export type FireScheduledJobResponse = PostApiScheduledJobsByIdFireResponse;
export type SyncScheduledJobsRequest = PostApiScheduledJobsSyncData["body"];
export type SyncScheduledJobsResponse = PostApiScheduledJobsSyncResponse;
export type ScheduledJobInstanceListResponse =
	GetApiScheduledJobsInstancesResponse;
export type ScheduledJobInstanceResponse =
	GetApiScheduledJobsInstancesByInstanceIdResponse;
export type ScheduledJobInstanceLogsResponse =
	GetApiScheduledJobsInstancesByInstanceIdLogsResponse;
export type InstanceLogRequest =
	PostApiScheduledJobsInstancesByInstanceIdLogData["body"];
export type InstanceLogResponse =
	PostApiScheduledJobsInstancesByInstanceIdLogResponse;
export type InstanceCompleteRequest =
	PostApiScheduledJobsInstancesByInstanceIdCompleteData["body"];
export type InstanceCompleteResponse =
	PostApiScheduledJobsInstancesByInstanceIdCompleteResponse;

export type ScheduledJobFilters = NonNullable<
	NonNullable<Parameters<typeof sdk.getApiScheduledJobs>[0]>["query"]
>;
export type ScheduledJobInstanceFilters = NonNullable<
	GetApiScheduledJobsInstancesData["query"]
>;

/**
 * Scheduled-jobs resource — full CRUD plus fire/pause/resume/archive/sync and
 * the SDK instance callbacks (log, complete).
 */
export class ScheduledJobsResource {
	private readonly client: FlowCatalystClient;

	constructor(client: FlowCatalystClient) {
		this.client = client;
	}

	/** List scheduled jobs with optional filters and pagination. */
	list(
		filters?: ScheduledJobFilters,
	): ResultAsync<ScheduledJobListResponse, SdkError> {
		return this.client.request<ScheduledJobListResponse>((httpClient, headers) =>
			sdk.getApiScheduledJobs({
				client: httpClient,
				headers,
				...(filters ? { query: filters } : {}),
			}),
		);
	}

	/** Get a scheduled job by ID. */
	get(id: string): ResultAsync<ScheduledJobResponse, SdkError> {
		return this.client.request<ScheduledJobResponse>((httpClient, headers) =>
			sdk.getApiScheduledJobsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/** Create a new scheduled job. */
	create(
		data: CreateScheduledJobRequest,
	): ResultAsync<CreateScheduledJobResponse, SdkError> {
		return this.client.request<CreateScheduledJobResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobs({
					client: httpClient,
					headers,
					body: data,
				}),
		);
	}

	/** Update a scheduled job (PATCH — partial). */
	update(
		id: string,
		data: UpdateScheduledJobRequest,
	): ResultAsync<UpdateScheduledJobResponse, SdkError> {
		return this.client.request<UpdateScheduledJobResponse>(
			(httpClient, headers) =>
				sdk.patchApiScheduledJobsById({
					client: httpClient,
					headers,
					path: { id },
					body: data,
				}),
		);
	}

	/** Hard-delete a scheduled job. Prefer `archive` for audit retention. */
	delete(id: string): ResultAsync<unknown, SdkError> {
		return this.client.request<unknown>((httpClient, headers) =>
			sdk.deleteApiScheduledJobsById({
				client: httpClient,
				headers,
				path: { id },
			}),
		);
	}

	/** Pause a scheduled job — stops firing on its cron. */
	pause(
		id: string,
	): ResultAsync<PostApiScheduledJobsByIdPauseResponse, SdkError> {
		return this.client.request<PostApiScheduledJobsByIdPauseResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobsByIdPause({
					client: httpClient,
					headers,
					path: { id },
				}),
		);
	}

	/** Resume a paused scheduled job. */
	resume(
		id: string,
	): ResultAsync<PostApiScheduledJobsByIdResumeResponse, SdkError> {
		return this.client.request<PostApiScheduledJobsByIdResumeResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobsByIdResume({
					client: httpClient,
					headers,
					path: { id },
				}),
		);
	}

	/** Archive (soft-delete) a scheduled job — kept for audit. */
	archive(
		id: string,
	): ResultAsync<PostApiScheduledJobsByIdArchiveResponse, SdkError> {
		return this.client.request<PostApiScheduledJobsByIdArchiveResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobsByIdArchive({
					client: httpClient,
					headers,
					path: { id },
				}),
		);
	}

	/** Manually fire a scheduled job — creates an instance immediately. */
	fire(
		id: string,
		data: FireScheduledJobRequest = {},
	): ResultAsync<FireScheduledJobResponse, SdkError> {
		return this.client.request<FireScheduledJobResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobsByIdFire({
					client: httpClient,
					headers,
					path: { id },
					body: data,
				}),
		);
	}

	/** Declarative sync — create/update/archive scheduled jobs in bulk. */
	sync(
		data: SyncScheduledJobsRequest,
	): ResultAsync<SyncScheduledJobsResponse, SdkError> {
		return this.client.request<SyncScheduledJobsResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobsSync({
					client: httpClient,
					headers,
					body: data,
				}),
		);
	}

	/** List instances across scheduled jobs (filter by `scheduledJobId`). */
	listInstances(
		filters?: ScheduledJobInstanceFilters,
	): ResultAsync<ScheduledJobInstanceListResponse, SdkError> {
		return this.client.request<ScheduledJobInstanceListResponse>(
			(httpClient, headers) =>
				sdk.getApiScheduledJobsInstances({
					client: httpClient,
					headers,
					...(filters ? { query: filters } : {}),
				}),
		);
	}

	/** Get a single scheduled-job instance. */
	getInstance(
		instanceId: string,
	): ResultAsync<ScheduledJobInstanceResponse, SdkError> {
		return this.client.request<ScheduledJobInstanceResponse>(
			(httpClient, headers) =>
				sdk.getApiScheduledJobsInstancesByInstanceId({
					client: httpClient,
					headers,
					path: { instanceId },
				}),
		);
	}

	/** List logs for an instance. */
	getInstanceLogs(
		instanceId: string,
	): ResultAsync<ScheduledJobInstanceLogsResponse, SdkError> {
		return this.client.request<ScheduledJobInstanceLogsResponse>(
			(httpClient, headers) =>
				sdk.getApiScheduledJobsInstancesByInstanceIdLogs({
					client: httpClient,
					headers,
					path: { instanceId },
				}),
		);
	}

	/** SDK callback — append a log entry to a running instance. */
	logForInstance(
		instanceId: string,
		data: InstanceLogRequest,
	): ResultAsync<InstanceLogResponse, SdkError> {
		return this.client.request<InstanceLogResponse>((httpClient, headers) =>
			sdk.postApiScheduledJobsInstancesByInstanceIdLog({
				client: httpClient,
				headers,
				path: { instanceId },
				body: data,
			}),
		);
	}

	/** SDK callback — mark an instance complete (SUCCESS or FAILURE). */
	completeInstance(
		instanceId: string,
		data: InstanceCompleteRequest,
	): ResultAsync<InstanceCompleteResponse, SdkError> {
		return this.client.request<InstanceCompleteResponse>(
			(httpClient, headers) =>
				sdk.postApiScheduledJobsInstancesByInstanceIdComplete({
					client: httpClient,
					headers,
					path: { instanceId },
					body: data,
				}),
		);
	}
}
