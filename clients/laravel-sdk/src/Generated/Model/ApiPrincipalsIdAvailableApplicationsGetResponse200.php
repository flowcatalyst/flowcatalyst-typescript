<?php

namespace FlowCatalyst\Generated\Model;

class ApiPrincipalsIdAvailableApplicationsGetResponse200 extends \ArrayObject
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
     * @var list<ApiPrincipalsIdAvailableApplicationsGetResponse200ApplicationsItem>|null
     */
    protected $applications;
    /**
     * @return list<ApiPrincipalsIdAvailableApplicationsGetResponse200ApplicationsItem>|null
     */
    public function getApplications(): ?array
    {
        return $this->applications;
    }
    /**
     * @param list<ApiPrincipalsIdAvailableApplicationsGetResponse200ApplicationsItem>|null $applications
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