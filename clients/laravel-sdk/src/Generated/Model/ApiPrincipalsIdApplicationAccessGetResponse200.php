<?php

namespace FlowCatalyst\Generated\Model;

class ApiPrincipalsIdApplicationAccessGetResponse200 extends \ArrayObject
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
     * @var list<ApiPrincipalsIdApplicationAccessGetResponse200ApplicationsItem>|null
     */
    protected $applications;
    /**
     * @return list<ApiPrincipalsIdApplicationAccessGetResponse200ApplicationsItem>|null
     */
    public function getApplications(): ?array
    {
        return $this->applications;
    }
    /**
     * @param list<ApiPrincipalsIdApplicationAccessGetResponse200ApplicationsItem>|null $applications
     *
     * @return self
     */
    public function setApplications(?array $applications): self
    {
        $this->initialized['applications'] = true;
        $this->applications = $applications;
        return $this;
    }
}