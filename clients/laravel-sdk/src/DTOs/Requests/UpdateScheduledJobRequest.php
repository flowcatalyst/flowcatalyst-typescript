<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Requests;

/**
 * Payload for PATCH /api/scheduled-jobs/{id}. All fields optional —
 * only set fields are sent.
 */
final class UpdateScheduledJobRequest
{
    /**
     * @param string[]|null $crons
     * @param array<string, mixed>|null $payload
     */
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?array $crons = null,
        public readonly ?string $timezone = null,
        public readonly ?array $payload = null,
        public readonly ?bool $concurrent = null,
        public readonly ?bool $tracksCompletion = null,
        public readonly ?int $timeoutSeconds = null,
        public readonly ?int $deliveryMaxAttempts = null,
        public readonly ?string $targetUrl = null,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $payload = [];
        if ($this->name !== null) {
            $payload['name'] = $this->name;
        }
        if ($this->description !== null) {
            $payload['description'] = $this->description;
        }
        if ($this->crons !== null) {
            $payload['crons'] = $this->crons;
        }
        if ($this->timezone !== null) {
            $payload['timezone'] = $this->timezone;
        }
        if ($this->payload !== null) {
            $payload['payload'] = $this->payload;
        }
        if ($this->concurrent !== null) {
            $payload['concurrent'] = $this->concurrent;
        }
        if ($this->tracksCompletion !== null) {
            $payload['tracksCompletion'] = $this->tracksCompletion;
        }
        if ($this->timeoutSeconds !== null) {
            $payload['timeoutSeconds'] = $this->timeoutSeconds;
        }
        if ($this->deliveryMaxAttempts !== null) {
            $payload['deliveryMaxAttempts'] = $this->deliveryMaxAttempts;
        }
        if ($this->targetUrl !== null) {
            $payload['targetUrl'] = $this->targetUrl;
        }

        return $payload;
    }
}
