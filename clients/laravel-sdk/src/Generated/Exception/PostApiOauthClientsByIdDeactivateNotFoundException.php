<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientsByIdDeactivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse404
     */
    private $apiOauthClientsIdDeactivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse404 $apiOauthClientsIdDeactivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdDeactivatePostResponse404 = $apiOauthClientsIdDeactivatePostResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdDeactivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse404
    {
        return $this->apiOauthClientsIdDeactivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}