<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Responses;

/**
 * Result of a scheduled-jobs sync — distinct shape from the generic SyncResult
 * because the platform returns per-code arrays rather than counts.
 */
final class SyncScheduledJobsResult
{
    /**
     * @param string[] $created
     * @param string[] $updated
     * @param string[] $archived
     */
    public function __construct(
        public readonly string $applicationCode,
        public readonly array $created,
        public readonly array $updated,
        public readonly array $archived,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var string[] $created */
        $created = $data['created'] ?? [];
        /** @var string[] $updated */
        $updated = $data['updated'] ?? [];
        /** @var string[] $archived */
        $archived = $data['archived'] ?? [];

        return new self(
            applicationCode: (string) ($data['applicationCode'] ?? ''),
            created: $created,
            updated: $updated,
            archived: $archived,
        );
    }
}
