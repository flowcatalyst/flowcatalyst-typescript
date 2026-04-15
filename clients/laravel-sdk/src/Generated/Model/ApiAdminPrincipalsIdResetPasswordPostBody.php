<?php

namespace FlowCatalyst\Generated\Model;

class ApiAdminPrincipalsIdResetPasswordPostBody extends \ArrayObject
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
     * When false, the platform skips its password complexity rules (uppercase/lowercase/digit/special) and only enforces a 2-character minimum. Intended for SDK callers that apply their own policy. Defaults to true.
     *
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
     * When false, the platform skips its password complexity rules (uppercase/lowercase/digit/special) and only enforces a 2-character minimum. Intended for SDK callers that apply their own policy. Defaults to true.
     *
     * @return mixed
     */
    public function getEnforcePasswordComplexity()
    {
        return $this->enforcePasswordComplexity;
    }
    /**
     * When false, the platform skips its password complexity rules (uppercase/lowercase/digit/special) and only enforces a 2-character minimum. Intended for SDK callers that apply their own policy. Defaults to true.
     *
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