<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsInstancesInstanceIdLogsGetResponse200 extends \ArrayObject
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
     * @var list<ApiScheduledJobsInstancesInstanceIdLogsGetResponse200LogsItem>|null
     */
    protected $logs;
    /**
     * @return list<ApiScheduledJobsInstancesInstanceIdLogsGetResponse200LogsItem>|null
     */
    public function getLogs(): ?array
    {
        return $this->logs;
    }
    /**
     * @param list<ApiScheduledJobsInstancesInstanceIdLogsGetResponse200LogsItem>|null $logs
     *
     * @return self
     */
    public function setLogs(?array $logs): self
    {
        $this->initialized['logs'] = true;
        $this->logs = $logs;
        return $this;
    }
}