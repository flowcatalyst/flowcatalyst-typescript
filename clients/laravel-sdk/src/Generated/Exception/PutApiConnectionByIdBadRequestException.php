<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiConnectionByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse400
     */
    private $apiConnectionsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse400 $apiConnectionsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdPutResponse400 = $apiConnectionsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiConnectionsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse400
    {
        return $this->apiConnectionsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}