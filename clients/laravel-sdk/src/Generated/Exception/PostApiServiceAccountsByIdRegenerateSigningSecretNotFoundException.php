<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiServiceAccountsByIdRegenerateSigningSecretNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse404
     */
    private $apiServiceAccountsIdRegenerateSigningSecretPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse404 $apiServiceAccountsIdRegenerateSigningSecretPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRegenerateSigningSecretPostResponse404 = $apiServiceAccountsIdRegenerateSigningSecretPostResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRegenerateSigningSecretPostResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse404
    {
        return $this->apiServiceAccountsIdRegenerateSigningSecretPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}