<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Responses;

use FlowCatalyst\DTOs\InstanceLog;

/**
 * Response from GET /api/scheduled-jobs/instances/{instanceId}/logs.
 */
final class InstanceLogList
{
    /**
     * @param InstanceLog[] $logs
     */
    public function __construct(
        public readonly array $logs,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var array<int, array<string, mixed>> $rows */
        $rows = $data['logs'] ?? [];

        return new self(
            logs: array_map(
                fn(array $row) => InstanceLog::fromArray($row),
                $rows,
            ),
        );
    }
}
