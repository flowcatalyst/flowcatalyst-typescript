<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiConnectionBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse400
     */
    private $apiConnectionsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsPostResponse400 $apiConnectionsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsPostResponse400 = $apiConnectionsPostResponse400;
        $this->response = $response;
    }
    public function getApiConnectionsPostResponse400(): \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse400
    {
        return $this->apiConnectionsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}