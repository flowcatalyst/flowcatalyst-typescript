<?php

namespace FlowCatalyst\Generated\Model;

class ApiEventsFilterOptionsGetResponse200 extends \ArrayObject
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
     * @var list<ApiEventsFilterOptionsGetResponse200ApplicationsItem>|null
     */
    protected $applications;
    /**
     * @var list<ApiEventsFilterOptionsGetResponse200SubdomainsItem>|null
     */
    protected $subdomains;
    /**
     * @var list<ApiEventsFilterOptionsGetResponse200AggregatesItem>|null
     */
    protected $aggregates;
    /**
     * @var list<ApiEventsFilterOptionsGetResponse200TypesItem>|null
     */
    protected $types;
    /**
     * @return list<ApiEventsFilterOptionsGetResponse200ApplicationsItem>|null
     */
    public function getApplications(): ?array
    {
        return $this->applications;
    }
    /**
     * @param list<ApiEventsFilterOptionsGetResponse200ApplicationsItem>|null $applications
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
     * @return list<ApiEventsFilterOptionsGetResponse200SubdomainsItem>|null
     */
    public function getSubdomains(): ?array
    {
        return $this->subdomains;
    }
    /**
     * @param list<ApiEventsFilterOptionsGetResponse200SubdomainsItem>|null $subdomains
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
     * @return list<ApiEventsFilterOptionsGetResponse200AggregatesItem>|null
     */
    public function getAggregates(): ?array
    {
        return $this->aggregates;
    }
    /**
     * @param list<ApiEventsFilterOptionsGetResponse200AggregatesItem>|null $aggregates
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
     * @return list<ApiEventsFilterOptionsGetResponse200TypesItem>|null
     */
    public function getTypes(): ?array
    {
        return $this->types;
    }
    /**
     * @param list<ApiEventsFilterOptionsGetResponse200TypesItem>|null $types
     *
     * @return self
     */
    public function setTypes(?array $types): self
    {
        $this->initialized['types'] = true;
        $this->types = $types;
        return $this;
    }
}