<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdOidcConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse409
     */
    private $apiAuthConfigsIdOidcPutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse409 $apiAuthConfigsIdOidcPutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdOidcPutResponse409 = $apiAuthConfigsIdOidcPutResponse409;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdOidcPutResponse409(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse409
    {
        return $this->apiAuthConfigsIdOidcPutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}