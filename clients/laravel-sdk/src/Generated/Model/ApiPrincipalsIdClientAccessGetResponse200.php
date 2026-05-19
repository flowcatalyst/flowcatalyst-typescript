<?php

namespace FlowCatalyst\Generated\Model;

class ApiPrincipalsIdClientAccessGetResponse200 extends \ArrayObject
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
     * @var list<ApiPrincipalsIdClientAccessGetResponse200GrantsItem>|null
     */
    protected $grants;
    /**
     * @return list<ApiPrincipalsIdClientAccessGetResponse200GrantsItem>|null
     */
    public function getGrants(): ?array
    {
        return $this->grants;
    }
    /**
     * @param list<ApiPrincipalsIdClientAccessGetResponse200GrantsItem>|null $grants
     *
     * @return self
     */
    public function setGrants(?array $grants): self
    {
        $this->initialized['grants'] = true;
        $this->grants = $grants;
        return $this;
    }
}