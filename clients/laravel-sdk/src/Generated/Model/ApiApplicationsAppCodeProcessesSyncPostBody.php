<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsAppCodeProcessesSyncPostBody extends \ArrayObject
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
     * @var list<ApiApplicationsAppCodeProcessesSyncPostBodyProcessesItem>|null
     */
    protected $processes;
    /**
     * @return list<ApiApplicationsAppCodeProcessesSyncPostBodyProcessesItem>|null
     */
    public function getProcesses(): ?array
    {
        return $this->processes;
    }
    /**
     * @param list<ApiApplicationsAppCodeProcessesSyncPostBodyProcessesItem>|null $processes
     *
     * @return self
     */
    public function setProcesses(?array $processes): self
    {
        $this->initialized['processes'] = true;
        $this->processes = $processes;
        return $this;
    }
}