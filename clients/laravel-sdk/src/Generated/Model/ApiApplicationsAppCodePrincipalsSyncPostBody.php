<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsAppCodePrincipalsSyncPostBody extends \ArrayObject
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
     * @var list<ApiApplicationsAppCodePrincipalsSyncPostBodyPrincipalsItem>|null
     */
    protected $principals;
    /**
     * @return list<ApiApplicationsAppCodePrincipalsSyncPostBodyPrincipalsItem>|null
     */
    public function getPrincipals(): ?array
    {
        return $this->principals;
    }
    /**
     * @param list<ApiApplicationsAppCodePrincipalsSyncPostBodyPrincipalsItem>|null $principals
     *
     * @return self
     */
    public function setPrincipals(?array $principals): self
    {
        $this->initialized['principals'] = true;
        $this->principals = $principals;
        return $this;
    }
}