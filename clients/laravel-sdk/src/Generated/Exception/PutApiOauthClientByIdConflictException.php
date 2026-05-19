<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiOauthClientByIdConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse409
     */
    private $apiOauthClientsIdPutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse409 $apiOauthClientsIdPutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdPutResponse409 = $apiOauthClientsIdPutResponse409;
        $this->response = $response;
    }
    public function getApiOauthClientsIdPutResponse409(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse409
    {
        return $this->apiOauthClientsIdPutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}