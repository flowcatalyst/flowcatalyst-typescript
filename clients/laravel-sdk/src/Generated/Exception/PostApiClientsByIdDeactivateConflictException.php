<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdDeactivateConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse409
     */
    private $apiClientsIdDeactivatePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse409 $apiClientsIdDeactivatePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdDeactivatePostResponse409 = $apiClientsIdDeactivatePostResponse409;
        $this->response = $response;
    }
    public function getApiClientsIdDeactivatePostResponse409(): \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse409
    {
        return $this->apiClientsIdDeactivatePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}