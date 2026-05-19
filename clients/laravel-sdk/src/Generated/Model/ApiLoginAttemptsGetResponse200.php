<?php

namespace FlowCatalyst\Generated\Model;

class ApiLoginAttemptsGetResponse200 extends \ArrayObject
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
     * @var list<ApiLoginAttemptsGetResponse200ItemsItem>|null
     */
    protected $items;
    /**
     * @var bool|null
     */
    protected $hasMore;
    /**
     * @var int|null
     */
    protected $page;
    /**
     * @var int|null
     */
    protected $pageSize;
    /**
     * @return list<ApiLoginAttemptsGetResponse200ItemsItem>|null
     */
    public function getItems(): ?array
    {
        return $this->items;
    }
    /**
     * @param list<ApiLoginAttemptsGetResponse200ItemsItem>|null $items
     *
     * @return self
     */
    public function setItems(?array $items): self
    {
        $this->initialized['items'] = true;
        $this->items = $items;
        return $this;
    }
    /**
     * @return bool|null
     */
    public function getHasMore(): ?bool
    {
        return $this->hasMore;
    }
    /**
     * @param bool|null $hasMore
     *
     * @return self
     */
    public function setHasMore(?bool $hasMore): self
    {
        $this->initialized['hasMore'] = true;
        $this->hasMore = $hasMore;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getPage(): ?int
    {
        return $this->page;
    }
    /**
     * @param int|null $page
     *
     * @return self
     */
    public function setPage(?int $page): self
    {
        $this->initialized['page'] = true;
        $this->page = $page;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getPageSize(): ?int
    {
        return $this->pageSize;
    }
    /**
     * @param int|null $pageSize
     *
     * @return self
     */
    public function setPageSize(?int $pageSize): self
    {
        $this->initialized['pageSize'] = true;
        $this->pageSize = $pageSize;
        return $this;
    }
}