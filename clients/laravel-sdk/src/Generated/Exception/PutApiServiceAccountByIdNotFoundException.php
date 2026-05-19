<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiServiceAccountByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse404
     */
    private $apiServiceAccountsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse404 $apiServiceAccountsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdPutResponse404 = $apiServiceAccountsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse404
    {
        return $this->apiServiceAccountsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}