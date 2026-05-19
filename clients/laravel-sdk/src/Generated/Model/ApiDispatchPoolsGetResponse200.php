<?php

namespace FlowCatalyst\Generated\Model;

class ApiDispatchPoolsGetResponse200 extends \ArrayObject
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
     * @var list<ApiDispatchPoolsGetResponse200PoolsItem>|null
     */
    protected $pools;
    /**
     * @var int|null
     */
    protected $total;
    /**
     * @return list<ApiDispatchPoolsGetResponse200PoolsItem>|null
     */
    public function getPools(): ?array
    {
        return $this->pools;
    }
    /**
     * @param list<ApiDispatchPoolsGetResponse200PoolsItem>|null $pools
     *
     * @return self
     */
    public function setPools(?array $pools): self
    {
        $this->initialized['pools'] = true;
        $this->pools = $pools;
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