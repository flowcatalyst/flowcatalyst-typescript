<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Responses;

use FlowCatalyst\DTOs\ScheduledJobInstance;

/**
 * Response from GET /api/scheduled-jobs/instances.
 */
final class ScheduledJobInstanceList
{
    /**
     * @param ScheduledJobInstance[] $instances
     */
    public function __construct(
        public readonly array $instances,
        public readonly int $total,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var array<int, array<string, mixed>> $rows */
        $rows = $data['instances'] ?? [];

        return new self(
            instances: array_map(
                fn(array $row) => ScheduledJobInstance::fromArray($row),
                $rows,
            ),
            total: (int) ($data['total'] ?? count($rows)),
        );
    }
}
