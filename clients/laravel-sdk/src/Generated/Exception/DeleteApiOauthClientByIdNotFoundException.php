<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiOauthClientByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeleteResponse404
     */
    private $apiOauthClientsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdDeleteResponse404 $apiOauthClientsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdDeleteResponse404 = $apiOauthClientsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeleteResponse404
    {
        return $this->apiOauthClientsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}