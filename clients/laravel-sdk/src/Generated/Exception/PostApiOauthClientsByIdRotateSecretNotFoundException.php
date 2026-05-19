<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientsByIdRotateSecretNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse404
     */
    private $apiOauthClientsIdRotateSecretPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse404 $apiOauthClientsIdRotateSecretPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdRotateSecretPostResponse404 = $apiOauthClientsIdRotateSecretPostResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdRotateSecretPostResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse404
    {
        return $this->apiOauthClientsIdRotateSecretPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}