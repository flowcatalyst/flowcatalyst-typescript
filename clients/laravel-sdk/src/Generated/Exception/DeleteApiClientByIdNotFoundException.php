<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiClientByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdDeleteResponse404
     */
    private $apiClientsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdDeleteResponse404 $apiClientsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdDeleteResponse404 = $apiClientsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdDeleteResponse404
    {
        return $this->apiClientsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}