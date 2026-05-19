<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiIdentityProviderByIdConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse409
     */
    private $apiIdentityProvidersIdPutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse409 $apiIdentityProvidersIdPutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersIdPutResponse409 = $apiIdentityProvidersIdPutResponse409;
        $this->response = $response;
    }
    public function getApiIdentityProvidersIdPutResponse409(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse409
    {
        return $this->apiIdentityProvidersIdPutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}