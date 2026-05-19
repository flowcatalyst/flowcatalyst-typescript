<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiOauthClientByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse400
     */
    private $apiOauthClientsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse400 $apiOauthClientsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdPutResponse400 = $apiOauthClientsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiOauthClientsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse400
    {
        return $this->apiOauthClientsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}