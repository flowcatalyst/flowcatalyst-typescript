<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiClientByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse404
     */
    private $apiClientsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdPutResponse404 $apiClientsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdPutResponse404 = $apiClientsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse404
    {
        return $this->apiClientsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}