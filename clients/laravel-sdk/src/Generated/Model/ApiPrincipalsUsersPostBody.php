<?php

namespace FlowCatalyst\Generated\Model;

class ApiPrincipalsUsersPostBody extends \ArrayObject
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
    protected $email;
    /**
     * @var mixed|null
     */
    protected $password;
    /**
     * @var string|null
     */
    protected $name;
    /**
     * @var mixed|null
     */
    protected $clientId;
    /**
     * @var mixed|null
     */
    protected $enforcePasswordComplexity;
    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }
    /**
     * @param string|null $email
     *
     * @return self
     */
    public function setEmail(?string $email): self
    {
        $this->initialized['email'] = true;
        $this->email = $email;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }
    /**
     * @param mixed $password
     *
     * @return self
     */
    public function setPassword($password): self
    {
        $this->initialized['password'] = true;
        $this->password = $password;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }
    /**
     * @param string|null $name
     *
     * @return self
     */
    public function setName(?string $name): self
    {
        $this->initialized['name'] = true;
        $this->name = $name;
        return $this;
    }
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