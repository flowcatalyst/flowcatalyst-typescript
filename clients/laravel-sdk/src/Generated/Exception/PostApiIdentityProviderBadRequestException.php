<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiIdentityProviderBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse400
     */
    private $apiIdentityProvidersPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse400 $apiIdentityProvidersPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersPostResponse400 = $apiIdentityProvidersPostResponse400;
        $this->response = $response;
    }
    public function getApiIdentityProvidersPostResponse400(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse400
    {
        return $this->apiIdentityProvidersPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}