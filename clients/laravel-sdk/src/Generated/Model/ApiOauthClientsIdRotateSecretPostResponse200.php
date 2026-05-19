<?php

namespace FlowCatalyst\Generated\Model;

class ApiOauthClientsIdRotateSecretPostResponse200 extends \ArrayObject
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
     * @var ApiOauthClientsIdRotateSecretPostResponse200Client|null
     */
    protected $client;
    /**
     * The plaintext client secret (shown only once)
     *
     * @var string|null
     */
    protected $clientSecret;
    /**
     * @return ApiOauthClientsIdRotateSecretPostResponse200Client|null
     */
    public function getClient(): ?ApiOauthClientsIdRotateSecretPostResponse200Client
    {
        return $this->client;
    }
    /**
     * @param ApiOauthClientsIdRotateSecretPostResponse200Client|null $client
     *
     * @return self
     */
    public function setClient(?ApiOauthClientsIdRotateSecretPostResponse200Client $client): self
    {
        $this->initialized['client'] = true;
        $this->client = $client;
        return $this;
    }
    /**
     * The plaintext client secret (shown only once)
     *
     * @return string|null
     */
    public function getClientSecret(): ?string
    {
        return $this->clientSecret;
    }
    /**
     * The plaintext client secret (shown only once)
     *
     * @param string|null $clientSecret
     *
     * @return self
     */
    public function setClientSecret(?string $clientSecret): self
    {
        $this->initialized['clientSecret'] = true;
        $this->clientSecret = $clientSecret;
        return $this;
    }
}