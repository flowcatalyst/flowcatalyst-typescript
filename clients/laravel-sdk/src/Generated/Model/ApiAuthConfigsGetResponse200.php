<?php

namespace FlowCatalyst\Generated\Model;

class ApiAuthConfigsGetResponse200 extends \ArrayObject
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
     * @var list<ApiAuthConfigsGetResponse200ConfigsItem>|null
     */
    protected $configs;
    /**
     * @var int|null
     */
    protected $total;
    /**
     * @return list<ApiAuthConfigsGetResponse200ConfigsItem>|null
     */
    public function getConfigs(): ?array
    {
        return $this->configs;
    }
    /**
     * @param list<ApiAuthConfigsGetResponse200ConfigsItem>|null $configs
     *
     * @return self
     */
    public function setConfigs(?array $configs): self
    {
        $this->initialized['configs'] = true;
        $this->configs = $configs;
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