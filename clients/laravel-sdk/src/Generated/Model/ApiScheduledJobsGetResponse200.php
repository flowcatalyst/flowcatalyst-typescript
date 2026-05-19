<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsGetResponse200 extends \ArrayObject
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
     * @var list<ApiScheduledJobsGetResponse200ScheduledJobsItem>|null
     */
    protected $scheduledJobs;
    /**
     * @var int|null
     */
    protected $total;
    /**
     * @return list<ApiScheduledJobsGetResponse200ScheduledJobsItem>|null
     */
    public function getScheduledJobs(): ?array
    {
        return $this->scheduledJobs;
    }
    /**
     * @param list<ApiScheduledJobsGetResponse200ScheduledJobsItem>|null $scheduledJobs
     *
     * @return self
     */
    public function setScheduledJobs(?array $scheduledJobs): self
    {
        $this->initialized['scheduledJobs'] = true;
        $this->scheduledJobs = $scheduledJobs;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getTotal(): ?int
    {
        return $this->total;
    }
    /**
     * @param int|null $total
     *
     * @return self
     */
    public function setTotal(?int $total): self
    {
        $this->initialized['total'] = true;
        $this->total = $total;
        return $this;
    }
}