<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem extends \ArrayObject
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
    protected $code;
    /**
     * @var string|null
     */
    protected $name;
    /**
     * @var string|null
     */
    protected $target;
    /**
     * @var string|null
     */
    protected $endpoint;
    /**
     * @var mixed|null
     */
    protected $connectionId;
    /**
     * @var string|null
     */
    protected $queue;
    /**
     * @var string|null
     */
    protected $dispatchPoolCode;
    /**
     * @var bool|null
     */
    protected $clientScoped;
    /**
     * @var int|null
     */
    protected $maxRetries;
    /**
     * @var int|null
     */
    protected $retryDelaySeconds;
    /**
     * @var int|null
     */
    protected $timeoutSeconds;
    /**
     * @var bool|null
     */
    protected $active;
    /**
     * @var mixed|null
     */
    protected $applicationCode;
    /**
     * @var mixed|null
     */
    protected $description;
    /**
     * @var mixed|null
     */
    protected $eventTypeCode;
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
     * @return string|null
     */
    public function getTarget(): ?string
    {
        return $this->target;
    }
    /**
     * @param string|null $target
     *
     * @return self
     */
    public function setTarget(?string $target): self
    {
        $this->initialized['target'] = true;
        $this->target = $target;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getEndpoint(): ?string
    {
        return $this->endpoint;
    }
    /**
     * @param string|null $endpoint
     *
     * @return self
     */
    public function setEndpoint(?string $endpoint): self
    {
        $this->initialized['endpoint'] = true;
        $this->endpoint = $endpoint;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getConnectionId()
    {
        return $this->connectionId;
    }
    /**
     * @param mixed $connectionId
     *
     * @return self
     */
    public function setConnectionId($connectionId): self
    {
        $this->initialized['connectionId'] = true;
        $this->connectionId = $connectionId;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getQueue(): ?string
    {
        return $this->queue;
    }
    /**
     * @param string|null $queue
     *
     * @return self
     */
    public function setQueue(?string $queue): self
    {
        $this->initialized['queue'] = true;
        $this->queue = $queue;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getDispatchPoolCode(): ?string
    {
        return $this->dispatchPoolCode;
    }
    /**
     * @param string|null $dispatchPoolCode
     *
     * @return self
     */
    public function setDispatchPoolCode(?string $dispatchPoolCode): self
    {
        $this->initialized['dispatchPoolCode'] = true;
        $this->dispatchPoolCode = $dispatchPoolCode;
        return $this;
    }
    /**
     * @return bool|null
     */
    public function getClientScoped(): ?bool
    {
        return $this->clientScoped;
    }
    /**
     * @param bool|null $clientScoped
     *
     * @return self
     */
    public function setClientScoped(?bool $clientScoped): self
    {
        $this->initialized['clientScoped'] = true;
        $this->clientScoped = $clientScoped;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getMaxRetries(): ?int
    {
        return $this->maxRetries;
    }
    /**
     * @param int|null $maxRetries
     *
     * @return self
     */
    public function setMaxRetries(?int $maxRetries): self
    {
        $this->initialized['maxRetries'] = true;
        $this->maxRetries = $maxRetries;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getRetryDelaySeconds(): ?int
    {
        return $this->retryDelaySeconds;
    }
    /**
     * @param int|null $retryDelaySeconds
     *
     * @return self
     */
    public function setRetryDelaySeconds(?int $retryDelaySeconds): self
    {
        $this->initialized['retryDelaySeconds'] = true;
        $this->retryDelaySeconds = $retryDelaySeconds;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getTimeoutSeconds(): ?int
    {
        return $this->timeoutSeconds;
    }
    /**
     * @param int|null $timeoutSeconds
     *
     * @return self
     */
    public function setTimeoutSeconds(?int $timeoutSeconds): self
    {
        $this->initialized['timeoutSeconds'] = true;
        $this->timeoutSeconds = $timeoutSeconds;
        return $this;
    }
    /**
     * @return bool|null
     */
    public function getActive(): ?bool
    {
        return $this->active;
    }
    /**
     * @param bool|null $active
     *
     * @return self
     */
    public function setActive(?bool $active): self
    {
        $this->initialized['active'] = true;
        $this->active = $active;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getApplicationCode()
    {
        return $this->applicationCode;
    }
    /**
     * @param mixed $applicationCode
     *
     * @return self
     */
    public function setApplicationCode($applicationCode): self
    {
        $this->initialized['applicationCode'] = true;
        $this->applicationCode = $applicationCode;
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
    public function getEventTypeCode()
    {
        return $this->eventTypeCode;
    }
    /**
     * @param mixed $eventTypeCode
     *
     * @return self
     */
    public function setEventTypeCode($eventTypeCode): self
    {
        $this->initialized['eventTypeCode'] = true;
        $this->eventTypeCode = $eventTypeCode;
        return $this;
    }
}