<?php

namespace FlowCatalyst\Generated\Model;

class ApiAuditLogsEntityEntityTypeEntityIdGetResponse200 extends \ArrayObject
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
     * @var list<ApiAuditLogsEntityEntityTypeEntityIdGetResponse200AuditLogsItem>|null
     */
    protected $auditLogs;
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
     * @return list<ApiAuditLogsEntityEntityTypeEntityIdGetResponse200AuditLogsItem>|null
     */
    public function getAuditLogs(): ?array
    {
        return $this->auditLogs;
    }
    /**
     * @param list<ApiAuditLogsEntityEntityTypeEntityIdGetResponse200AuditLogsItem>|null $auditLogs
     *
     * @return self
     */
    public function setAuditLogs(?array $auditLogs): self
    {
        $this->initialized['auditLogs'] = true;
        $this->auditLogs = $auditLogs;
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