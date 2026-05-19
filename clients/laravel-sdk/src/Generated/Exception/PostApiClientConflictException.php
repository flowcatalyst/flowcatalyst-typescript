<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsPostResponse409
     */
    private $apiClientsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsPostResponse409 $apiClientsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsPostResponse409 = $apiClientsPostResponse409;
        $this->response = $response;
    }
    public function getApiClientsPostResponse409(): \FlowCatalyst\Generated\Model\ApiClientsPostResponse409
    {
        return $this->apiClientsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}