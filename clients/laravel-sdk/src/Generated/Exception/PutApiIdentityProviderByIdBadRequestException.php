<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiIdentityProviderByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse400
     */
    private $apiIdentityProvidersIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse400 $apiIdentityProvidersIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersIdPutResponse400 = $apiIdentityProvidersIdPutResponse400;
        $this->response = $response;
    }
    public function getApiIdentityProvidersIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse400
    {
        return $this->apiIdentityProvidersIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}