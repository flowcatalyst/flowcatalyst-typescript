<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdDeactivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse404
     */
    private $apiClientsIdDeactivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse404 $apiClientsIdDeactivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdDeactivatePostResponse404 = $apiClientsIdDeactivatePostResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdDeactivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse404
    {
        return $this->apiClientsIdDeactivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}