<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiConnectionByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse400
     */
    private $apiConnectionsIdDeleteResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse400 $apiConnectionsIdDeleteResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConnectionsIdDeleteResponse400 = $apiConnectionsIdDeleteResponse400;
        $this->response = $response;
    }
    public function getApiConnectionsIdDeleteResponse400(): \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse400
    {
        return $this->apiConnectionsIdDeleteResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}