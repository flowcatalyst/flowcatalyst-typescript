<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs;

/**
 * A scheduled job definition.
 *
 * Matches the platform's ScheduledJobResponse. A scheduled job is a cron-driven
 * (or manually-fired) job definition fired into a webhook target URL.
 */
final class ScheduledJob
{
    /**
     * @param string[] $crons
     * @param array<string, mixed>|null $payload
     */
    public function __construct(
        public readonly string $id,
        public readonly string $code,
        public readonly string $name,
        public readonly string $status,
        public readonly array $crons,
        public readonly string $timezone,
        public readonly bool $concurrent,
        public readonly bool $tracksCompletion,
        public readonly int $deliveryMaxAttempts,
        public readonly string $createdAt,
        public readonly string $updatedAt,
        public readonly int $version,
        public readonly bool $hasActiveInstance = false,
        public readonly ?string $description = null,
        public readonly ?string $clientId = null,
        public readonly ?array $payload = null,
        public readonly ?int $timeoutSeconds = null,
        public readonly ?string $targetUrl = null,
        public readonly ?string $lastFiredAt = null,
        public readonly ?string $createdBy = null,
        public readonly ?string $updatedBy = null,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var string[] $crons */
        $crons = $data['crons'] ?? [];
        /** @var array<string, mixed>|null $payload */
        $payload = $data['payload'] ?? null;

        return new self(
            id: (string) $data['id'],
            code: (string) $data['code'],
            name: (string) $data['name'],
            status: (string) ($data['status'] ?? 'ACTIVE'),
            crons: $crons,
            timezone: (string) ($data['timezone'] ?? 'UTC'),
            concurrent: (bool) ($data['concurrent'] ?? false),
            tracksCompletion: (bool) ($data['tracksCompletion'] ?? false),
            deliveryMaxAttempts: (int) ($data['deliveryMaxAttempts'] ?? 3),
            createdAt: (string) ($data['createdAt'] ?? ''),
            updatedAt: (string) ($data['updatedAt'] ?? ''),
            version: (int) ($data['version'] ?? 1),
            hasActiveInstance: (bool) ($data['hasActiveInstance'] ?? false),
            description: isset($data['description']) ? (string) $data['description'] : null,
            clientId: isset($data['clientId']) ? (string) $data['clientId'] : null,
            payload: $payload,
            timeoutSeconds: isset($data['timeoutSeconds']) ? (int) $data['timeoutSeconds'] : null,
            targetUrl: isset($data['targetUrl']) ? (string) $data['targetUrl'] : null,
            lastFiredAt: isset($data['lastFiredAt']) ? (string) $data['lastFiredAt'] : null,
            createdBy: isset($data['createdBy']) ? (string) $data['createdBy'] : null,
            updatedBy: isset($data['updatedBy']) ? (string) $data['updatedBy'] : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'status' => $this->status,
            'crons' => $this->crons,
            'timezone' => $this->timezone,
            'concurrent' => $this->concurrent,
            'tracksCompletion' => $this->tracksCompletion,
            'deliveryMaxAttempts' => $this->deliveryMaxAttempts,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'version' => $this->version,
            'hasActiveInstance' => $this->hasActiveInstance,
            'description' => $this->description,
            'clientId' => $this->clientId,
            'payload' => $this->payload,
            'timeoutSeconds' => $this->timeoutSeconds,
            'targetUrl' => $this->targetUrl,
            'lastFiredAt' => $this->lastFiredAt,
            'createdBy' => $this->createdBy,
            'updatedBy' => $this->updatedBy,
        ];
    }
}
