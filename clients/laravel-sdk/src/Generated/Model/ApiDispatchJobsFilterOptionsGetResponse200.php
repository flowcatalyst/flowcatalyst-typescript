<?php

namespace FlowCatalyst\Generated\Model;

class ApiDispatchJobsFilterOptionsGetResponse200 extends \ArrayObject
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
     * @var list<ApiDispatchJobsFilterOptionsGetResponse200ApplicationsItem>|null
     */
    protected $applications;
    /**
     * @var list<ApiDispatchJobsFilterOptionsGetResponse200SubdomainsItem>|null
     */
    protected $subdomains;
    /**
     * @var list<ApiDispatchJobsFilterOptionsGetResponse200AggregatesItem>|null
     */
    protected $aggregates;
    /**
     * @var list<ApiDispatchJobsFilterOptionsGetResponse200CodesItem>|null
     */
    protected $codes;
    /**
     * @var list<ApiDispatchJobsFilterOptionsGetResponse200StatusesItem>|null
     */
    protected $statuses;
    /**
     * @return list<ApiDispatchJobsFilterOptionsGetResponse200ApplicationsItem>|null
     */
    public function getApplications(): ?array
    {
        return $this->applications;
    }
    /**
     * @param list<ApiDispatchJobsFilterOptionsGetResponse200ApplicationsItem>|null $applications
     *
     * @return self
     */
    public function setApplications(?array $applications): self
    {
        $this->initialized['applications'] = true;
        $this->applications = $applications;
        return $this;
    }
    /**
     * @return list<ApiDispatchJobsFilterOptionsGetResponse200SubdomainsItem>|null
     */
    public function getSubdomains(): ?array
    {
        return $this->subdomains;
    }
    /**
     * @param list<ApiDispatchJobsFilterOptionsGetResponse200SubdomainsItem>|null $subdomains
     *
     * @return self
     */
    public function setSubdomains(?array $subdomains): self
    {
        $this->initialized['subdomains'] = true;
        $this->subdomains = $subdomains;
        return $this;
    }
    /**
     * @return list<ApiDispatchJobsFilterOptionsGetResponse200AggregatesItem>|null
     */
    public function getAggregates(): ?array
    {
        return $this->aggregates;
    }
    /**
     * @param list<ApiDispatchJobsFilterOptionsGetResponse200AggregatesItem>|null $aggregates
     *
     * @return self
     */
    public function setAggregates(?array $aggregates): self
    {
        $this->initialized['aggregates'] = true;
        $this->aggregates = $aggregates;
        return $this;
    }
    /**
     * @return list<ApiDispatchJobsFilterOptionsGetResponse200CodesItem>|null
     */
    public function getCodes(): ?array
    {
        return $this->codes;
    }
    /**
     * @param list<ApiDispatchJobsFilterOptionsGetResponse200CodesItem>|null $codes
     *
     * @return self
     */
    public function setCodes(?array $codes): self
    {
        $this->initialized['codes'] = true;
        $this->codes = $codes;
        return $this;
    }
    /**
     * @return list<ApiDispatchJobsFilterOptionsGetResponse200StatusesItem>|null
     */
    public function getStatuses(): ?array
    {
        return $this->statuses;
    }
    /**
     * @param list<ApiDispatchJobsFilterOptionsGetResponse200StatusesItem>|null $statuses
     *
     * @return self
     */
    public function setStatuses(?array $statuses): self
    {
        $this->initialized['statuses'] = true;
        $this->statuses = $statuses;
        return $this;
    }
}