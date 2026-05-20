<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs;

/**
 * A scheduled-job instance — one firing of a scheduled job.
 *
 * Matches the platform's InstanceResponse.
 */
final class ScheduledJobInstance
{
    /**
     * @param array<string, mixed>|null $completionResult
     */
    public function __construct(
        public readonly string $id,
        public readonly string $scheduledJobId,
        public readonly string $jobCode,
        public readonly string $triggerKind,
        public readonly string $firedAt,
        public readonly string $status,
        public readonly int $deliveryAttempts,
        public readonly string $createdAt,
        public readonly ?string $clientId = null,
        public readonly ?string $scheduledFor = null,
        public readonly ?string $deliveredAt = null,
        public readonly ?string $completedAt = null,
        public readonly ?string $deliveryError = null,
        public readonly ?string $completionStatus = null,
        public readonly ?array $completionResult = null,
        public readonly ?string $correlationId = null,
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        /** @var array<string, mixed>|null $completionResult */
        $completionResult = $data['completionResult'] ?? null;

        return new self(
            id: (string) $data['id'],
            scheduledJobId: (string) $data['scheduledJobId'],
            jobCode: (string) $data['jobCode'],
            triggerKind: (string) $data['triggerKind'],
            firedAt: (string) $data['firedAt'],
            status: (string) $data['status'],
            deliveryAttempts: (int) ($data['deliveryAttempts'] ?? 0),
            createdAt: (string) ($data['createdAt'] ?? ''),
            clientId: isset($data['clientId']) ? (string) $data['clientId'] : null,
            scheduledFor: isset($data['scheduledFor']) ? (string) $data['scheduledFor'] : null,
            deliveredAt: isset($data['deliveredAt']) ? (string) $data['deliveredAt'] : null,
            completedAt: isset($data['completedAt']) ? (string) $data['completedAt'] : null,
            deliveryError: isset($data['deliveryError']) ? (string) $data['deliveryError'] : null,
            completionStatus: isset($data['completionStatus']) ? (string) $data['completionStatus'] : null,
            completionResult: $completionResult,
            correlationId: isset($data['correlationId']) ? (string) $data['correlationId'] : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'scheduledJobId' => $this->scheduledJobId,
            'jobCode' => $this->jobCode,
            'triggerKind' => $this->triggerKind,
            'firedAt' => $this->firedAt,
            'status' => $this->status,
            'deliveryAttempts' => $this->deliveryAttempts,
            'createdAt' => $this->createdAt,
            'clientId' => $this->clientId,
            'scheduledFor' => $this->scheduledFor,
            'deliveredAt' => $this->deliveredAt,
            'completedAt' => $this->completedAt,
            'deliveryError' => $this->deliveryError,
            'completionStatus' => $this->completionStatus,
            'completionResult' => $this->completionResult,
            'correlationId' => $this->correlationId,
        ];
    }
}
