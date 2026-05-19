<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsIdFirePostBody extends \ArrayObject
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
    protected $correlationId;
    /**
     * @return mixed
     */
    public function getCorrelationId()
    {
        return $this->correlationId;
    }
    /**
     * @param mixed $correlationId
     *
     * @return self
     */
    public function setCorrelationId($correlationId): self
    {
        $this->initialized['correlationId'] = true;
        $this->correlationId = $correlationId;
        return $this;
    }
}