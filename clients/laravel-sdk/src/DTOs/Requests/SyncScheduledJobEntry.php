<?php

declare(strict_types=1);

namespace FlowCatalyst\DTOs\Requests;

/**
 * One entry in a scheduled-jobs sync payload.
 */
final class SyncScheduledJobEntry
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
        $entry = [
            'code' => $this->code,
            'name' => $this->name,
            'crons' => $this->crons,
            'concurrent' => $this->concurrent,
            'tracksCompletion' => $this->tracksCompletion,
        ];
        if ($this->description !== null) {
            $entry['description'] = $this->description;
        }
        if ($this->timezone !== null) {
            $entry['timezone'] = $this->timezone;
        }
        if ($this->payload !== null) {
            $entry['payload'] = $this->payload;
        }
        if ($this->timeoutSeconds !== null) {
            $entry['timeoutSeconds'] = $this->timeoutSeconds;
        }
        if ($this->deliveryMaxAttempts !== null) {
            $entry['deliveryMaxAttempts'] = $this->deliveryMaxAttempts;
        }
        if ($this->targetUrl !== null) {
            $entry['targetUrl'] = $this->targetUrl;
        }

        return $entry;
    }
}
