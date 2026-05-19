<?php

namespace FlowCatalyst\Generated\Model;

class ApiPrincipalsIdResetPasswordPostBody extends \ArrayObject
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
     * @var string|null
     */
    protected $newPassword;
    /**
     * @var mixed|null
     */
    protected $enforcePasswordComplexity;
    /**
     * @return string|null
     */
    public function getNewPassword(): ?string
    {
        return $this->newPassword;
    }
    /**
     * @param string|null $newPassword
     *
     * @return self
     */
    public function setNewPassword(?string $newPassword): self
    {
        $this->initialized['newPassword'] = true;
        $this->newPassword = $newPassword;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getEnforcePasswordComplexity()
    {
        return $this->enforcePasswordComplexity;
    }
    /**
     * @param mixed $enforcePasswordComplexity
     *
     * @return self
     */
    public function setEnforcePasswordComplexity($enforcePasswordComplexity): self
    {
        $this->initialized['enforcePasswordComplexity'] = true;
        $this->enforcePasswordComplexity = $enforcePasswordComplexity;
        return $this;
    }
}