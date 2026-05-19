<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiClientsByIdApplicationNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse404
     */
    private $apiClientsIdApplicationsPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse404 $apiClientsIdApplicationsPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdApplicationsPutResponse404 = $apiClientsIdApplicationsPutResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdApplicationsPutResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse404
    {
        return $this->apiClientsIdApplicationsPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}