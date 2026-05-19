<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiConnectionsByIdPauseNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse404
     */
    private $apiConnectionsIdPausePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse404 $apiConnectionsIdPausePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdPausePostResponse404 = $apiConnectionsIdPausePostResponse404;
        $this->response = $response;
    }
    public function getApiConnectionsIdPausePostResponse404(): \FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse404
    {
        return $this->apiConnectionsIdPausePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}