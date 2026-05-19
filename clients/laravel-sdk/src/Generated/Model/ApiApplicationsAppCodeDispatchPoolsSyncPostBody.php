<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsAppCodeDispatchPoolsSyncPostBody extends \ArrayObject
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
     * @var list<ApiApplicationsAppCodeDispatchPoolsSyncPostBodyPoolsItem>|null
     */
    protected $pools;
    /**
     * @return list<ApiApplicationsAppCodeDispatchPoolsSyncPostBodyPoolsItem>|null
     */
    public function getPools(): ?array
    {
        return $this->pools;
    }
    /**
     * @param list<ApiApplicationsAppCodeDispatchPoolsSyncPostBodyPoolsItem>|null $pools
     *
     * @return self
     */
    public function setPools(?array $pools): self
    {
        $this->initialized['pools'] = true;
        $this->pools = $pools;
        return $this;
    }
}