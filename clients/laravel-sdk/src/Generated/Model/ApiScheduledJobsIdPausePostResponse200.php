<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsIdPausePostResponse200 extends \ArrayObject
{
    /**
     * @var array
     */
    protected $initialized = [];
    public function isInitialized($property): bool
    {
        return array_key_exists($property, $this->initialized);
    }
    /**
     * @var string|null
     */
    protected $id;
    /**
     * @var mixed|null
     */
    protected $clientId;
    /**
     * @var string|null
     */
    protected $code;
    /**
     * @var string|null
     */
    protected $name;
    /**
     * @var mixed|null
     */
    protected $description;
    /**
     * @var mixed|null
     */
    protected $status;
    /**
     * @var list<string>|null
     */
    protected $crons;
    /**
     * @var string|null
     */
    protected $timezone;
    /**
     * @var mixed|null
     */
    protected $payload;
    /**
     * @var bool|null
     */
    protected $concurrent;
    /**
     * @var bool|null
     */
    protected $tracksCompletion;
    /**
     * @var mixed|null
     */
    protected $timeoutSeconds;
    /**
     * @var int|null
     */
    protected $deliveryMaxAttempts;
    /**
     * @var mixed|null
     */
    protected $targetUrl;
    /**
     * @var mixed|null
     */
    protected $lastFiredAt;
    /**
     * @var \DateTime|null
     */
    protected $createdAt;
    /**
     * @var \DateTime|null
     */
    protected $updatedAt;
    /**
     * @var mixed|null
     */
    protected $createdBy;
    /**
     * @var mixed|null
     */
    protected $updatedBy;
    /**
     * @var int|null
     */
    protected $version;
    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }
    /**
     * @param string|null $id
     *
     * @return self
     */
    public function setId(?string $id): self
    {
        $this->initialized['id'] = true;
        $this->id = $id;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getClientId()
    {
        return $this->clientId;
    }
    /**
     * @param mixed $clientId
     *
     * @return self
     */
    public function setClientId($clientId): self
    {
        $this->initialized['clientId'] = true;
        $this->clientId = $clientId;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getCode(): ?string
    {
        return $this->code;
    }
    /**
     * @param string|null $code
     *
     * @return self
     */
    public function setCode(?string $code): self
    {
        $this->initialized['code'] = true;
        $this->code = $code;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }
    /**
     * @param string|null $name
     *
     * @return self
     */
    public function setName(?string $name): self
    {
        $this->initialized['name'] = true;
        $this->name = $name;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }
    /**
     * @param mixed $description
     *
     * @return self
     */
    public function setDescription($description): self
    {
        $this->initialized['description'] = true;
        $this->description = $description;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }
    /**
     * @param mixed $status
     *
     * @return self
     */
    public function setStatus($status): self
    {
        $this->initialized['status'] = true;
        $this->status = $status;
        return $this;
    }
    /**
     * @return list<string>|null
     */
    public function getCrons(): ?array
    {
        return $this->crons;
    }
    /**
     * @param list<string>|null $crons
     *
     * @return self
     */
    public function setCrons(?array $crons): self
    {
        $this->initialized['crons'] = true;
        $this->crons = $crons;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getTimezone(): ?string
    {
        return $this->timezone;
    }
    /**
     * @param string|null $timezone
     *
     * @return self
     */
    public function setTimezone(?string $timezone): self
    {
        $this->initialized['timezone'] = true;
        $this->timezone = $timezone;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getPayload()
    {
        return $this->payload;
    }
    /**
     * @param mixed $payload
     *
     * @return self
     */
    public function setPayload($payload): self
    {
        $this->initialized['payload'] = true;
        $this->payload = $payload;
        return $this;
    }
    /**
     * @return bool|null
     */
    public function getConcurrent(): ?bool
    {
        return $this->concurrent;
    }
    /**
     * @param bool|null $concurrent
     *
     * @return self
     */
    public function setConcurrent(?bool $concurrent): self
    {
        $this->initialized['concurrent'] = true;
        $this->concurrent = $concurrent;
        return $this;
    }
    /**
     * @return bool|null
     */
    public function getTracksCompletion(): ?bool
    {
        return $this->tracksCompletion;
    }
    /**
     * @param bool|null $tracksCompletion
     *
     * @return self
     */
    public function setTracksCompletion(?bool $tracksCompletion): self
    {
        $this->initialized['tracksCompletion'] = true;
        $this->tracksCompletion = $tracksCompletion;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getTimeoutSeconds()
    {
        return $this->timeoutSeconds;
    }
    /**
     * @param mixed $timeoutSeconds
     *
     * @return self
     */
    public function setTimeoutSeconds($timeoutSeconds): self
    {
        $this->initialized['timeoutSeconds'] = true;
        $this->timeoutSeconds = $timeoutSeconds;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getDeliveryMaxAttempts(): ?int
    {
        return $this->deliveryMaxAttempts;
    }
    /**
     * @param int|null $deliveryMaxAttempts
     *
     * @return self
     */
    public function setDeliveryMaxAttempts(?int $deliveryMaxAttempts): self
    {
        $this->initialized['deliveryMaxAttempts'] = true;
        $this->deliveryMaxAttempts = $deliveryMaxAttempts;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getTargetUrl()
    {
        return $this->targetUrl;
    }
    /**
     * @param mixed $targetUrl
     *
     * @return self
     */
    public function setTargetUrl($targetUrl): self
    {
        $this->initialized['targetUrl'] = true;
        $this->targetUrl = $targetUrl;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getLastFiredAt()
    {
        return $this->lastFiredAt;
    }
    /**
     * @param mixed $lastFiredAt
     *
     * @return self
     */
    public function setLastFiredAt($lastFiredAt): self
    {
        $this->initialized['lastFiredAt'] = true;
        $this->lastFiredAt = $lastFiredAt;
        return $this;
    }
    /**
     * @return \DateTime|null
     */
    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }
    /**
     * @param \DateTime|null $createdAt
     *
     * @return self
     */
    public function setCreatedAt(?\DateTime $createdAt): self
    {
        $this->initialized['createdAt'] = true;
        $this->createdAt = $createdAt;
        return $this;
    }
    /**
     * @return \DateTime|null
     */
    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }
    /**
     * @param \DateTime|null $updatedAt
     *
     * @return self
     */
    public function setUpdatedAt(?\DateTime $updatedAt): self
    {
        $this->initialized['updatedAt'] = true;
        $this->updatedAt = $updatedAt;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }
    /**
     * @param mixed $createdBy
     *
     * @return self
     */
    public function setCreatedBy($createdBy): self
    {
        $this->initialized['createdBy'] = true;
        $this->createdBy = $createdBy;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }
    /**
     * @param mixed $updatedBy
     *
     * @return self
     */
    public function setUpdatedBy($updatedBy): self
    {
        $this->initialized['updatedBy'] = true;
        $this->updatedBy = $updatedBy;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getVersion(): ?int
    {
        return $this->version;
    }
    /**
     * @param int|null $version
     *
     * @return self
     */
    public function setVersion(?int $version): self
    {
        $this->initialized['version'] = true;
        $this->version = $version;
        return $this;
    }
}