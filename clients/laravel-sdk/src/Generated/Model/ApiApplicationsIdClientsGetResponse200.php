<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsIdClientsGetResponse200 extends \ArrayObject
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
     * @var list<ApiApplicationsIdClientsGetResponse200ConfigsItem>|null
     */
    protected $configs;
    /**
     * @return list<ApiApplicationsIdClientsGetResponse200ConfigsItem>|null
     */
    public function getConfigs(): ?array
    {
        return $this->configs;
    }
    /**
     * @param list<ApiApplicationsIdClientsGetResponse200ConfigsItem>|null $configs
     *
     * @return self
     */
    public function setConfigs(?array $configs): self
    {
        $this->initialized['configs'] = true;
        $this->configs = $configs;
        return $this;
    }
}