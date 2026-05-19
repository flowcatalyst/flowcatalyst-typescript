<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiConnectionByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse404
     */
    private $apiConnectionsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse404 $apiConnectionsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdDeleteResponse404 = $apiConnectionsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiConnectionsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse404
    {
        return $this->apiConnectionsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}