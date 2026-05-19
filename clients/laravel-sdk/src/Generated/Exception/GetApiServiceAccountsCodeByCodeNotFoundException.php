<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiServiceAccountsCodeByCodeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse404
     */
    private $apiServiceAccountsCodeCodeGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse404 $apiServiceAccountsCodeCodeGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsCodeCodeGetResponse404 = $apiServiceAccountsCodeCodeGetResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsCodeCodeGetResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse404
    {
        return $this->apiServiceAccountsCodeCodeGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}