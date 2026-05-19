<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdActivateConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse409
     */
    private $apiClientsIdActivatePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse409 $apiClientsIdActivatePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdActivatePostResponse409 = $apiClientsIdActivatePostResponse409;
        $this->response = $response;
    }
    public function getApiClientsIdActivatePostResponse409(): \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse409
    {
        return $this->apiClientsIdActivatePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}