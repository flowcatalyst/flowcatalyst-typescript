<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientsByIdRotateSecretBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse400
     */
    private $apiOauthClientsIdRotateSecretPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse400 $apiOauthClientsIdRotateSecretPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsIdRotateSecretPostResponse400 = $apiOauthClientsIdRotateSecretPostResponse400;
        $this->response = $response;
    }
    public function getApiOauthClientsIdRotateSecretPostResponse400(): \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse400
    {
        return $this->apiOauthClientsIdRotateSecretPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}