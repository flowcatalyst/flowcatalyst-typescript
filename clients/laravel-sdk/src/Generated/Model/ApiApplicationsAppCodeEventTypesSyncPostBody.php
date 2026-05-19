<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsAppCodeEventTypesSyncPostBody extends \ArrayObject
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
     * @var list<ApiApplicationsAppCodeEventTypesSyncPostBodyEventTypesItem>|null
     */
    protected $eventTypes;
    /**
     * @return list<ApiApplicationsAppCodeEventTypesSyncPostBodyEventTypesItem>|null
     */
    public function getEventTypes(): ?array
    {
        return $this->eventTypes;
    }
    /**
     * @param list<ApiApplicationsAppCodeEventTypesSyncPostBodyEventTypesItem>|null $eventTypes
     *
     * @return self
     */
    public function setEventTypes(?array $eventTypes): self
    {
        $this->initialized['eventTypes'] = true;
        $this->eventTypes = $eventTypes;
        return $this;
    }
}