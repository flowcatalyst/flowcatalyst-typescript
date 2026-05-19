<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiConnectionConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse409
     */
    private $apiConnectionsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsPostResponse409 $apiConnectionsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsPostResponse409 = $apiConnectionsPostResponse409;
        $this->response = $response;
    }
    public function getApiConnectionsPostResponse409(): \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse409
    {
        return $this->apiConnectionsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}