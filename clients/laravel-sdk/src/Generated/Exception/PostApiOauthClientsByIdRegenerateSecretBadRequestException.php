<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientsByIdRegenerateSecretBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse400
     */
    private $apiOauthClientsIdRegenerateSecretPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse400 $apiOauthClientsIdRegenerateSecretPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdRegenerateSecretPostResponse400 = $apiOauthClientsIdRegenerateSecretPostResponse400;
        $this->response = $response;
    }
    public function getApiOauthClientsIdRegenerateSecretPostResponse400(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse400
    {
        return $this->apiOauthClientsIdRegenerateSecretPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}