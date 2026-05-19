<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdOidcNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse404
     */
    private $apiAuthConfigsIdOidcPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse404 $apiAuthConfigsIdOidcPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdOidcPutResponse404 = $apiAuthConfigsIdOidcPutResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdOidcPutResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse404
    {
        return $this->apiAuthConfigsIdOidcPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}