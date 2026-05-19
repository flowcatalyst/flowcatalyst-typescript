<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiConnectionsByIdActivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse404
     */
    private $apiConnectionsIdActivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse404 $apiConnectionsIdActivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdActivatePostResponse404 = $apiConnectionsIdActivatePostResponse404;
        $this->response = $response;
    }
    public function getApiConnectionsIdActivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse404
    {
        return $this->apiConnectionsIdActivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}