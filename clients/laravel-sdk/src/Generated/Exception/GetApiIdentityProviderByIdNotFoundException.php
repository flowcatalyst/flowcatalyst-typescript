<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiIdentityProviderByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse404
     */
    private $apiIdentityProvidersIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse404 $apiIdentityProvidersIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersIdGetResponse404 = $apiIdentityProvidersIdGetResponse404;
        $this->response = $response;
    }
    public function getApiIdentityProvidersIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse404
    {
        return $this->apiIdentityProvidersIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}