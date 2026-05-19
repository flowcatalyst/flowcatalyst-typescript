<?php

namespace FlowCatalyst\Generated\Model;

class ApiProcessesGetResponse200 extends \ArrayObject
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
     * @var list<ApiProcessesGetResponse200ItemsItem>|null
     */
    protected $items;
    /**
     * @return list<ApiProcessesGetResponse200ItemsItem>|null
     */
    public function getItems(): ?array
    {
        return $this->items;
    }
    /**
     * @param list<ApiProcessesGetResponse200ItemsItem>|null $items
     *
     * @return self
     */
    public function setItems(?array $items): self
    {
        $this->initialized['items'] = true;
        $this->items = $items;
        return $this;
    }
}