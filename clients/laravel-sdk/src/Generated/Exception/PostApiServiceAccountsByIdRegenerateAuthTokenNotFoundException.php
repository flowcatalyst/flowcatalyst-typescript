<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiServiceAccountsByIdRegenerateAuthTokenNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse404
     */
    private $apiServiceAccountsIdRegenerateAuthTokenPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse404 $apiServiceAccountsIdRegenerateAuthTokenPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRegenerateAuthTokenPostResponse404 = $apiServiceAccountsIdRegenerateAuthTokenPostResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRegenerateAuthTokenPostResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse404
    {
        return $this->apiServiceAccountsIdRegenerateAuthTokenPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}