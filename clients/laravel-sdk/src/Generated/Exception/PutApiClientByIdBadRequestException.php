<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiClientByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse400
     */
    private $apiClientsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdPutResponse400 $apiClientsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdPutResponse400 = $apiClientsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiClientsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse400
    {
        return $this->apiClientsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}