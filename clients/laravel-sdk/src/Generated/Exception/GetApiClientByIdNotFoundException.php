<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiClientByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse404
     */
    private $apiClientsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdGetResponse404 $apiClientsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdGetResponse404 = $apiClientsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse404
    {
        return $this->apiClientsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}