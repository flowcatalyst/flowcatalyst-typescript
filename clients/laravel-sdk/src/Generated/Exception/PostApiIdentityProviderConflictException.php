<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiIdentityProviderConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse409
     */
    private $apiIdentityProvidersPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse409 $apiIdentityProvidersPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersPostResponse409 = $apiIdentityProvidersPostResponse409;
        $this->response = $response;
    }
    public function getApiIdentityProvidersPostResponse409(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse409
    {
        return $this->apiIdentityProvidersPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}