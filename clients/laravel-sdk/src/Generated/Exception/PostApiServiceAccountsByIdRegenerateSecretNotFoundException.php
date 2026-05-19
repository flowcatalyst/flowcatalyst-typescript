<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiServiceAccountsByIdRegenerateSecretNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse404
     */
    private $apiServiceAccountsIdRegenerateSecretPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse404 $apiServiceAccountsIdRegenerateSecretPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRegenerateSecretPostResponse404 = $apiServiceAccountsIdRegenerateSecretPostResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRegenerateSecretPostResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse404
    {
        return $this->apiServiceAccountsIdRegenerateSecretPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}