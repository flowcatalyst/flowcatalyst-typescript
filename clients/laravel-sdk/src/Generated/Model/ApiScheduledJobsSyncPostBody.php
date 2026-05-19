<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsSyncPostBody extends \ArrayObject
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
     * @var mixed|null
     */
    protected $clientId;
    /**
     * @var list<ApiScheduledJobsSyncPostBodyScheduledJobsItem>|null
     */
    protected $scheduledJobs;
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
     * @return list<ApiScheduledJobsSyncPostBodyScheduledJobsItem>|null
     */
    public function getScheduledJobs(): ?array
    {
        return $this->scheduledJobs;
    }
    /**
     * @param list<ApiScheduledJobsSyncPostBodyScheduledJobsItem>|null $scheduledJobs
     *
     * @return self
     */
    public function setScheduledJobs(?array $scheduledJobs): self
    {
        $this->initialized['scheduledJobs'] = true;
        $this->scheduledJobs = $scheduledJobs;
        return $this;
    }
}