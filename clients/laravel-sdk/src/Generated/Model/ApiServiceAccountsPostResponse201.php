<?php

namespace FlowCatalyst\Generated\Model;

class ApiServiceAccountsPostResponse201 extends \ArrayObject
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
     * @var ApiServiceAccountsPostResponse201ServiceAccount|null
     */
    protected $serviceAccount;
    /**
     * @var string|null
     */
    protected $principalId;
    /**
     * @var ApiServiceAccountsPostResponse201Oauth|null
     */
    protected $oauth;
    /**
     * @var ApiServiceAccountsPostResponse201Webhook|null
     */
    protected $webhook;
    /**
     * @return ApiServiceAccountsPostResponse201ServiceAccount|null
     */
    public function getServiceAccount(): ?ApiServiceAccountsPostResponse201ServiceAccount
    {
        return $this->serviceAccount;
    }
    /**
     * @param ApiServiceAccountsPostResponse201ServiceAccount|null $serviceAccount
     *
     * @return self
     */
    public function setServiceAccount(?ApiServiceAccountsPostResponse201ServiceAccount $serviceAccount): self
    {
        $this->initialized['serviceAccount'] = true;
        $this->serviceAccount = $serviceAccount;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getPrincipalId(): ?string
    {
        return $this->principalId;
    }
    /**
     * @param string|null $principalId
     *
     * @return self
     */
    public function setPrincipalId(?string $principalId): self
    {
        $this->initialized['principalId'] = true;
        $this->principalId = $principalId;
        return $this;
    }
    /**
     * @return ApiServiceAccountsPostResponse201Oauth|null
     */
    public function getOauth(): ?ApiServiceAccountsPostResponse201Oauth
    {
        return $this->oauth;
    }
    /**
     * @param ApiServiceAccountsPostResponse201Oauth|null $oauth
     *
     * @return self
     */
    public function setOauth(?ApiServiceAccountsPostResponse201Oauth $oauth): self
    {
        $this->initialized['oauth'] = true;
        $this->oauth = $oauth;
        return $this;
    }
    /**
     * @return ApiServiceAccountsPostResponse201Webhook|null
     */
    public function getWebhook(): ?ApiServiceAccountsPostResponse201Webhook
    {
        return $this->webhook;
    }
    /**
     * @param ApiServiceAccountsPostResponse201Webhook|null $webhook
     *
     * @return self
     */
    public function setWebhook(?ApiServiceAccountsPostResponse201Webhook $webhook): self
    {
        $this->initialized['webhook'] = true;
        $this->webhook = $webhook;
        return $this;
    }
}