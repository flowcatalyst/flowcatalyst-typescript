<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsSyncPostResponse200 extends \ArrayObject
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
     * @var mixed|null
     */
    protected $clientId;
    /**
     * @var int|null
     */
    protected $synced;
    /**
     * @var int|null
     */
    protected $created;
    /**
     * @var int|null
     */
    protected $updated;
    /**
     * @return mixed
     */
    public function getClientId()
    {
        return $this->clientId;
    }
    /**
     * @param mixed $clientId
     *
     * @return self
     */
    public function setClientId($clientId): self
    {
        $this->initialized['clientId'] = true;
        $this->clientId = $clientId;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getSynced(): ?int
    {
        return $this->synced;
    }
    /**
     * @param int|null $synced
     *
     * @return self
     */
    public function setSynced(?int $synced): self
    {
        $this->initialized['synced'] = true;
        $this->synced = $synced;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getCreated(): ?int
    {
        return $this->created;
    }
    /**
     * @param int|null $created
     *
     * @return self
     */
    public function setCreated(?int $created): self
    {
        $this->initialized['created'] = true;
        $this->created = $created;
        return $this;
    }
    /**
     * @return int|null
     */
    public function getUpdated(): ?int
    {
        return $this->updated;
    }
    /**
     * @param int|null $updated
     *
     * @return self
     */
    public function setUpdated(?int $updated): self
    {
        $this->initialized['updated'] = true;
        $this->updated = $updated;
        return $this;
    }
}