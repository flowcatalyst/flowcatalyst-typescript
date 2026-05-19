<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiOauthClientByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse404
     */
    private $apiOauthClientsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse404 $apiOauthClientsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdPutResponse404 = $apiOauthClientsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse404
    {
        return $this->apiOauthClientsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}