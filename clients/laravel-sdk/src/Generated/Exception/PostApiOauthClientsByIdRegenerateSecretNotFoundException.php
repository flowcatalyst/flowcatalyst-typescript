<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientsByIdRegenerateSecretNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse404
     */
    private $apiOauthClientsIdRegenerateSecretPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse404 $apiOauthClientsIdRegenerateSecretPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdRegenerateSecretPostResponse404 = $apiOauthClientsIdRegenerateSecretPostResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsIdRegenerateSecretPostResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse404
    {
        return $this->apiOauthClientsIdRegenerateSecretPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}