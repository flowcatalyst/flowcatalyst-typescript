<?php

namespace FlowCatalyst\Generated\Model;

class ApiOauthClientsPostResponse201 extends \ArrayObject
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
     * @var ApiOauthClientsPostResponse201Client|null
     */
    protected $client;
    /**
     * Auto-generated plaintext client secret for CONFIDENTIAL clients (shown only once)
     *
     * @var string|null
     */
    protected $clientSecret;
    /**
     * @return ApiOauthClientsPostResponse201Client|null
     */
    public function getClient(): ?ApiOauthClientsPostResponse201Client
    {
        return $this->client;
    }
    /**
     * @param ApiOauthClientsPostResponse201Client|null $client
     *
     * @return self
     */
    public function setClient(?ApiOauthClientsPostResponse201Client $client): self
    {
        $this->initialized['client'] = true;
        $this->client = $client;
        return $this;
    }
    /**
     * Auto-generated plaintext client secret for CONFIDENTIAL clients (shown only once)
     *
     * @return string|null
     */
    public function getClientSecret(): ?string
    {
        return $this->clientSecret;
    }
    /**
     * Auto-generated plaintext client secret for CONFIDENTIAL clients (shown only once)
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