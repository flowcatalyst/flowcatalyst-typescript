<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdActivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse404
     */
    private $apiClientsIdActivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse404 $apiClientsIdActivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdActivatePostResponse404 = $apiClientsIdActivatePostResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdActivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse404
    {
        return $this->apiClientsIdActivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}