<?php

namespace FlowCatalyst\Generated\Model;

class ApiRolesPermissionsGetResponse200 extends \ArrayObject
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
     * @var list<ApiRolesPermissionsGetResponse200PermissionsItem>|null
     */
    protected $permissions;
    /**
     * @return list<ApiRolesPermissionsGetResponse200PermissionsItem>|null
     */
    public function getPermissions(): ?array
    {
        return $this->permissions;
    }
    /**
     * @param list<ApiRolesPermissionsGetResponse200PermissionsItem>|null $permissions
     *
     * @return self
     */
    public function setPermissions(?array $permissions): self
    {
        $this->initialized['permissions'] = true;
        $this->permissions = $permissions;
        return $this;
    }
}