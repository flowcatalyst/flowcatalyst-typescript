<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientsByIdActivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse404
     */
    private $apiOauthClientsIdActivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse404 $apiOauthClientsIdActivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdActivatePostResponse404 = $apiOauthClientsIdActivatePostResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdActivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse404
    {
        return $this->apiOauthClientsIdActivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}