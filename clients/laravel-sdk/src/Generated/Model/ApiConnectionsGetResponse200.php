<?php

namespace FlowCatalyst\Generated\Model;

class ApiConnectionsGetResponse200 extends \ArrayObject
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
     * @var list<ApiConnectionsGetResponse200ConnectionsItem>|null
     */
    protected $connections;
    /**
     * @var int|null
     */
    protected $total;
    /**
     * @return list<ApiConnectionsGetResponse200ConnectionsItem>|null
     */
    public function getConnections(): ?array
    {
        return $this->connections;
    }
    /**
     * @param list<ApiConnectionsGetResponse200ConnectionsItem>|null $connections
     *
     * @return self
     */
    public function setConnections(?array $connections): self
    {
        $this->initialized['connections'] = true;
        $this->connections = $connections;
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