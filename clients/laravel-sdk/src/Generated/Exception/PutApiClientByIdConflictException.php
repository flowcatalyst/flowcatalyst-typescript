<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiClientByIdConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse409
     */
    private $apiClientsIdPutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdPutResponse409 $apiClientsIdPutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdPutResponse409 = $apiClientsIdPutResponse409;
        $this->response = $response;
    }
    public function getApiClientsIdPutResponse409(): \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse409
    {
        return $this->apiClientsIdPutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}