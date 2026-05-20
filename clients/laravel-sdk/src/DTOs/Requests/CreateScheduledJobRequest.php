<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Requests;

/**
 * Payload for POST /api/scheduled-jobs.
 *
 * Omit `clientId` for platform-scoped jobs (anchor only).
 */
final class CreateScheduledJobRequest
{
    /**
     * @param string[] $crons
     * @param array<string, mixed>|null $payload
     */
    public function __construct(
        public readonly string $code,
        public readonly string $name,
        public readonly array $crons,
        public readonly ?string $description = null,
        public readonly ?string $clientId = null,
        public readonly ?string $timezone = null,
        public readonly ?array $payload = null,
        public readonly bool $concurrent = false,
        public readonly bool $tracksCompletion = false,
        public readonly ?int $timeoutSeconds = null,
        public readonly ?int $deliveryMaxAttempts = null,
        public readonly ?string $targetUrl = null,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $payload = [
            'code' => $this->code,
            'name' => $this->name,
            'crons' => $this->crons,
            'concurrent' => $this->concurrent,
            'tracksCompletion' => $this->tracksCompletion,
        ];
        if ($this->description !== null) {
            $payload['description'] = $this->description;
        }
        if ($this->clientId !== null) {
            $payload['clientId'] = $this->clientId;
        }
        if ($this->timezone !== null) {
            $payload['timezone'] = $this->timezone;
        }
        if ($this->payload !== null) {
            $payload['payload'] = $this->payload;
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
