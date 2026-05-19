<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiConnectionByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse404
     */
    private $apiConnectionsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse404 $apiConnectionsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdPutResponse404 = $apiConnectionsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiConnectionsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse404
    {
        return $this->apiConnectionsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}