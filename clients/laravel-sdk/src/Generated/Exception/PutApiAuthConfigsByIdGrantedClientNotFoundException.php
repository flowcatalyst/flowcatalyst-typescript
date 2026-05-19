<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdGrantedClientNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse404
     */
    private $apiAuthConfigsIdGrantedClientsPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse404 $apiAuthConfigsIdGrantedClientsPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdGrantedClientsPutResponse404 = $apiAuthConfigsIdGrantedClientsPutResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdGrantedClientsPutResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse404
    {
        return $this->apiAuthConfigsIdGrantedClientsPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}