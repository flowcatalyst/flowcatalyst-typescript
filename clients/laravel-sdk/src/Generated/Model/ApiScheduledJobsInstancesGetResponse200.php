<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsInstancesGetResponse200 extends \ArrayObject
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
     * @var list<ApiScheduledJobsInstancesGetResponse200InstancesItem>|null
     */
    protected $instances;
    /**
     * @var int|null
     */
    protected $total;
    /**
     * @return list<ApiScheduledJobsInstancesGetResponse200InstancesItem>|null
     */
    public function getInstances(): ?array
    {
        return $this->instances;
    }
    /**
     * @param list<ApiScheduledJobsInstancesGetResponse200InstancesItem>|null $instances
     *
     * @return self
     */
    public function setInstances(?array $instances): self
    {
        $this->initialized['instances'] = true;
        $this->instances = $instances;
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