<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdSuspendConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse409
     */
    private $apiClientsIdSuspendPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse409 $apiClientsIdSuspendPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdSuspendPostResponse409 = $apiClientsIdSuspendPostResponse409;
        $this->response = $response;
    }
    public function getApiClientsIdSuspendPostResponse409(): \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse409
    {
        return $this->apiClientsIdSuspendPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}