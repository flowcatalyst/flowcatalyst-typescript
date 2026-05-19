<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsInstancesInstanceIdGetResponse200 extends \ArrayObject
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
     * @var string|null
     */
    protected $scheduledJobId;
    /**
     * @var mixed|null
     */
    protected $clientId;
    /**
     * @var string|null
     */
    protected $jobCode;
    /**
     * @var mixed|null
     */
    protected $triggerKind;
    /**
     * @var mixed|null
     */
    protected $scheduledFor;
    /**
     * @var \DateTime|null
     */
    protected $firedAt;
    /**
     * @var mixed|null
     */
    protected $deliveredAt;
    /**
     * @var mixed|null
     */
    protected $completedAt;
    /**
     * @var mixed|null
     */
    protected $status;
    /**
     * @var int|null
     */
    protected $deliveryAttempts;
    /**
     * @var mixed|null
     */
    protected $deliveryError;
    /**
     * @var mixed|null
     */
    protected $completionStatus;
    /**
     * @var mixed|null
     */
    protected $completionResult;
    /**
     * @var mixed|null
     */
    protected $correlationId;
    /**
     * @var \DateTime|null
     */
    protected $createdAt;
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
     * @return string|null
     */
    public function getScheduledJobId(): ?string
    {
        return $this->scheduledJobId;
    }
    /**
     * @param string|null $scheduledJobId
     *
     * @return self
     */
    public function setScheduledJobId(?string $scheduledJobId): self
    {
        $this->initialized['scheduledJobId'] = true;
        $this->scheduledJobId = $scheduledJobId;
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
    public function getJobCode(): ?string
    {
        return $this->jobCode;
    }
    /**
     * @param string|null $jobCode
     *
     * @return self
     */
    public function setJobCode(?string $jobCode): self
    {
        $this->initialized['jobCode'] = true;
        $this->jobCode = $jobCode;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getTriggerKind()
    {
        return $this->triggerKind;
    }
    /**
     * @param mixed $triggerKind
     *
     * @return self
     */
    public function setTriggerKind($triggerKind): self
    {
        $this->initialized['triggerKind'] = true;
        $this->triggerKind = $triggerKind;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getScheduledFor()
    {
        return $this->scheduledFor;
    }
    /**
     * @param mixed $scheduledFor
     *
     * @return self
     */
    public function setScheduledFor($scheduledFor): self
    {
        $this->initialized['scheduledFor'] = true;
        $this->scheduledFor = $scheduledFor;
        return $this;
    }
    /**
     * @return \DateTime|null
     */
    public function getFiredAt(): ?\DateTime
    {
        return $this->firedAt;
    }
    /**
     * @param \DateTime|null $firedAt
     *
     * @return self
     */
    public function setFiredAt(?\DateTime $firedAt): self
    {
        $this->initialized['firedAt'] = true;
        $this->firedAt = $firedAt;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getDeliveredAt()
    {
        return $this->deliveredAt;
    }
    /**
     * @param mixed $deliveredAt
     *
     * @return self
     */
    public function setDeliveredAt($deliveredAt): self
    {
        $this->initialized['deliveredAt'] = true;
        $this->deliveredAt = $deliveredAt;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getCompletedAt()
    {
        return $this->completedAt;
    }
    /**
     * @param mixed $completedAt
     *
     * @return self
     */
    public function setCompletedAt($completedAt): self
    {
        $this->initialized['completedAt'] = true;
        $this->completedAt = $completedAt;
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
     * @return int|null
     */
    public function getDeliveryAttempts(): ?int
    {
        return $this->deliveryAttempts;
    }
    /**
     * @param int|null $deliveryAttempts
     *
     * @return self
     */
    public function setDeliveryAttempts(?int $deliveryAttempts): self
    {
        $this->initialized['deliveryAttempts'] = true;
        $this->deliveryAttempts = $deliveryAttempts;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getDeliveryError()
    {
        return $this->deliveryError;
    }
    /**
     * @param mixed $deliveryError
     *
     * @return self
     */
    public function setDeliveryError($deliveryError): self
    {
        $this->initialized['deliveryError'] = true;
        $this->deliveryError = $deliveryError;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getCompletionStatus()
    {
        return $this->completionStatus;
    }
    /**
     * @param mixed $completionStatus
     *
     * @return self
     */
    public function setCompletionStatus($completionStatus): self
    {
        $this->initialized['completionStatus'] = true;
        $this->completionStatus = $completionStatus;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getCompletionResult()
    {
        return $this->completionResult;
    }
    /**
     * @param mixed $completionResult
     *
     * @return self
     */
    public function setCompletionResult($completionResult): self
    {
        $this->initialized['completionResult'] = true;
        $this->completionResult = $completionResult;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getCorrelationId()
    {
        return $this->correlationId;
    }
    /**
     * @param mixed $correlationId
     *
     * @return self
     */
    public function setCorrelationId($correlationId): self
    {
        $this->initialized['correlationId'] = true;
        $this->correlationId = $correlationId;
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
}