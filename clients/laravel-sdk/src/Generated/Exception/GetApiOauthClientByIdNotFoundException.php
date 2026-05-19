<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiOauthClientByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse404
     */
    private $apiOauthClientsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse404 $apiOauthClientsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdGetResponse404 = $apiOauthClientsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse404
    {
        return $this->apiOauthClientsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}