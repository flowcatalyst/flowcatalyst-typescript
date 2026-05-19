<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdSuspendNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse404
     */
    private $apiClientsIdSuspendPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse404 $apiClientsIdSuspendPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdSuspendPostResponse404 = $apiClientsIdSuspendPostResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdSuspendPostResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse404
    {
        return $this->apiClientsIdSuspendPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}