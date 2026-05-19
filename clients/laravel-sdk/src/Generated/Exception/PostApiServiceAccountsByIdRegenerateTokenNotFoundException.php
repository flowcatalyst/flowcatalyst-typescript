<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiServiceAccountsByIdRegenerateTokenNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse404
     */
    private $apiServiceAccountsIdRegenerateTokenPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse404 $apiServiceAccountsIdRegenerateTokenPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRegenerateTokenPostResponse404 = $apiServiceAccountsIdRegenerateTokenPostResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRegenerateTokenPostResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse404
    {
        return $this->apiServiceAccountsIdRegenerateTokenPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}