<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs;

/**
 * A log entry attached to a scheduled-job instance.
 */
final class InstanceLog
{
    /**
     * @param array<string, mixed>|null $metadata
     */
    public function __construct(
        public readonly string $id,
        public readonly string $instanceId,
        public readonly string $level,
        public readonly string $message,
        public readonly string $createdAt,
        public readonly ?array $metadata = null,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var array<string, mixed>|null $metadata */
        $metadata = $data['metadata'] ?? null;

        return new self(
            id: (string) $data['id'],
            instanceId: (string) $data['instanceId'],
            level: (string) ($data['level'] ?? 'INFO'),
            message: (string) ($data['message'] ?? ''),
            createdAt: (string) ($data['createdAt'] ?? ''),
            metadata: $metadata,
        );
    }
}
