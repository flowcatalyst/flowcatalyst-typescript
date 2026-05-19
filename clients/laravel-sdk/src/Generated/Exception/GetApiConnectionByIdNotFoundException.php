<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiConnectionByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse404
     */
    private $apiConnectionsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse404 $apiConnectionsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdGetResponse404 = $apiConnectionsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiConnectionsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse404
    {
        return $this->apiConnectionsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}