<?php

declare(strict_types=1);

namespace FlowCatalyst\Client\Resources;

use FlowCatalyst\Client\FlowCatalystClient;
use FlowCatalyst\DTOs\Requests\CreateScheduledJobRequest;
use FlowCatalyst\DTOs\Requests\SyncScheduledJobEntry;
use FlowCatalyst\DTOs\Requests\UpdateScheduledJobRequest;
use FlowCatalyst\DTOs\Responses\InstanceLogList;
use FlowCatalyst\DTOs\Responses\ScheduledJobInstanceList;
use FlowCatalyst\DTOs\Responses\ScheduledJobList;
use FlowCatalyst\DTOs\Responses\SyncScheduledJobsResult;
use FlowCatalyst\DTOs\InstanceLog;
use FlowCatalyst\DTOs\ScheduledJob;
use FlowCatalyst\DTOs\ScheduledJobInstance;

/**
 * Scheduled-jobs API surface — cron-driven (or manually-fired) jobs that
 * the platform fires into a webhook target URL.
 */
class ScheduledJobs
{
    public function __construct(
        private readonly FlowCatalystClient $client
    ) {}

    /**
     * List scheduled jobs.
     */
    public function list(
        ?string $clientId = null,
        ?string $status = null,
        ?string $search = null,
        ?int $page = null,
        ?int $size = null,
    ): ScheduledJobList {
        $queryParams = [];
        if ($clientId !== null) {
            $queryParams['clientId'] = $clientId;
        }
        if ($status !== null) {
            $queryParams['status'] = $status;
        }
        if ($search !== null) {
            $queryParams['search'] = $search;
        }
        if ($page !== null) {
            $queryParams['page'] = $page;
        }
        if ($size !== null) {
            $queryParams['size'] = $size;
        }
        $query = !empty($queryParams) ? '?' . http_build_query($queryParams) : '';

        $response = $this->client->request('GET', "/api/scheduled-jobs{$query}");

        return ScheduledJobList::fromArray($response);
    }

    /**
     * Get a scheduled job by ID.
     */
    public function get(string $id): ScheduledJob
    {
        $response = $this->client->request('GET', "/api/scheduled-jobs/{$id}");

        return ScheduledJob::fromArray($response);
    }

    /**
     * Create a scheduled job. Returns the new job's ID.
     */
    public function create(CreateScheduledJobRequest $request): string
    {
        $response = $this->client->request('POST', '/api/scheduled-jobs', [
            'json' => $request->toArray(),
        ]);

        return (string) $response['id'];
    }

    /**
     * Update a scheduled job (PATCH — partial).
     */
    public function update(string $id, UpdateScheduledJobRequest $request): ScheduledJob
    {
        $response = $this->client->request('PATCH', "/api/scheduled-jobs/{$id}", [
            'json' => $request->toArray(),
        ]);

        return ScheduledJob::fromArray($response);
    }

    /**
     * Hard-delete a scheduled job. Prefer `archive()` for audit retention.
     */
    public function delete(string $id): void
    {
        $this->client->request('DELETE', "/api/scheduled-jobs/{$id}");
    }

    /**
     * Pause a scheduled job — stops firing on its cron.
     */
    public function pause(string $id): ScheduledJob
    {
        $response = $this->client->request('POST', "/api/scheduled-jobs/{$id}/pause");

        return ScheduledJob::fromArray($response);
    }

    /**
     * Resume a paused scheduled job.
     */
    public function resume(string $id): ScheduledJob
    {
        $response = $this->client->request('POST', "/api/scheduled-jobs/{$id}/resume");

        return ScheduledJob::fromArray($response);
    }

    /**
     * Archive (soft-delete) a scheduled job — kept for audit.
     */
    public function archive(string $id): ScheduledJob
    {
        $response = $this->client->request('POST', "/api/scheduled-jobs/{$id}/archive");

        return ScheduledJob::fromArray($response);
    }

    /**
     * Manually fire a scheduled job. Returns the new instance ID.
     */
    public function fire(string $id, ?string $correlationId = null): string
    {
        $body = [];
        if ($correlationId !== null) {
            $body['correlationId'] = $correlationId;
        }

        $response = $this->client->request('POST', "/api/scheduled-jobs/{$id}/fire", [
            'json' => $body,
        ]);

        return (string) ($response['instanceId'] ?? $response['id'] ?? '');
    }

    /**
     * Sync scheduled jobs for an application — declarative reconciliation.
     *
     * Unlike the other resource syncs, scheduled-jobs sync uses `archiveUnlisted`
     * in the body (not `removeUnlisted` in the query) and returns a distinct
     * `{ applicationCode, created, updated, archived }` shape with per-code
     * arrays rather than counts.
     *
     * @param SyncScheduledJobEntry[] $jobs
     */
    public function sync(
        string $applicationCode,
        array $jobs,
        bool $archiveUnlisted = false,
        ?string $clientId = null,
    ): SyncScheduledJobsResult {
        $body = [
            'jobs' => array_map(
                fn(SyncScheduledJobEntry $entry) => $entry->toArray(),
                $jobs,
            ),
            'archiveUnlisted' => $archiveUnlisted,
        ];
        if ($clientId !== null) {
            $body['clientId'] = $clientId;
        }

        $response = $this->client->request(
            'POST',
            "/api/applications/{$applicationCode}/scheduled-jobs/sync",
            ['json' => $body],
        );

        return SyncScheduledJobsResult::fromArray($response);
    }

    /**
     * List instances across scheduled jobs. Filter by `$scheduledJobId` to
     * list instances of a single job.
     */
    public function listInstances(
        ?string $scheduledJobId = null,
        ?string $clientId = null,
        ?string $status = null,
        ?string $triggerKind = null,
        ?string $from = null,
        ?string $to = null,
        ?int $limit = null,
        ?int $offset = null,
    ): ScheduledJobInstanceList {
        $queryParams = [];
        if ($scheduledJobId !== null) {
            $queryParams['scheduledJobId'] = $scheduledJobId;
        }
        if ($clientId !== null) {
            $queryParams['clientId'] = $clientId;
        }
        if ($status !== null) {
            $queryParams['status'] = $status;
        }
        if ($triggerKind !== null) {
            $queryParams['triggerKind'] = $triggerKind;
        }
        if ($from !== null) {
            $queryParams['from'] = $from;
        }
        if ($to !== null) {
            $queryParams['to'] = $to;
        }
        if ($limit !== null) {
            $queryParams['limit'] = $limit;
        }
        if ($offset !== null) {
            $queryParams['offset'] = $offset;
        }
        $query = !empty($queryParams) ? '?' . http_build_query($queryParams) : '';

        $response = $this->client->request('GET', "/api/scheduled-jobs/instances{$query}");

        return ScheduledJobInstanceList::fromArray($response);
    }

    /**
     * Get a single scheduled-job instance.
     */
    public function getInstance(string $instanceId): ScheduledJobInstance
    {
        $response = $this->client->request(
            'GET',
            "/api/scheduled-jobs/instances/{$instanceId}",
        );

        return ScheduledJobInstance::fromArray($response);
    }

    /**
     * List logs for an instance.
     */
    public function getInstanceLogs(string $instanceId): InstanceLogList
    {
        $response = $this->client->request(
            'GET',
            "/api/scheduled-jobs/instances/{$instanceId}/logs",
        );

        return InstanceLogList::fromArray($response);
    }

    /**
     * SDK callback — append a log entry to a running instance.
     *
     * @param array<string, mixed>|null $metadata
     */
    public function logForInstance(
        string $instanceId,
        string $message,
        string $level = 'INFO',
        ?array $metadata = null,
    ): InstanceLog {
        $body = [
            'message' => $message,
            'level' => $level,
        ];
        if ($metadata !== null) {
            $body['metadata'] = $metadata;
        }

        $response = $this->client->request(
            'POST',
            "/api/scheduled-jobs/instances/{$instanceId}/log",
            ['json' => $body],
        );

        return InstanceLog::fromArray($response);
    }

    /**
     * SDK callback — mark an instance complete with status SUCCESS or FAILURE.
     *
     * @param array<string, mixed>|null $result
     */
    public function completeInstance(
        string $instanceId,
        string $status,
        ?array $result = null,
    ): ScheduledJobInstance {
        $body = [
            'status' => $status,
        ];
        if ($result !== null) {
            $body['result'] = $result;
        }

        $response = $this->client->request(
            'POST',
            "/api/scheduled-jobs/instances/{$instanceId}/complete",
            ['json' => $body],
        );

        return ScheduledJobInstance::fromArray($response);
    }
}
