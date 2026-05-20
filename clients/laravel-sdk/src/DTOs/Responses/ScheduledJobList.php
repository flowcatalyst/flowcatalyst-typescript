<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Responses;

use FlowCatalyst\DTOs\ScheduledJob;

/**
 * Response from GET /api/scheduled-jobs.
 */
final class ScheduledJobList
{
    /**
     * @param ScheduledJob[] $scheduledJobs
     */
    public function __construct(
        public readonly array $scheduledJobs,
        public readonly int $total,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var array<int, array<string, mixed>> $rows */
        $rows = $data['scheduledJobs'] ?? [];

        return new self(
            scheduledJobs: array_map(
                fn(array $row) => ScheduledJob::fromArray($row),
                $rows,
            ),
            total: (int) ($data['total'] ?? count($rows)),
        );
    }
}
