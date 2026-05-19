<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiIdentityProviderByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse404
     */
    private $apiIdentityProvidersIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse404 $apiIdentityProvidersIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersIdPutResponse404 = $apiIdentityProvidersIdPutResponse404;
        $this->response = $response;
    }
    public function getApiIdentityProvidersIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse404
    {
        return $this->apiIdentityProvidersIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}