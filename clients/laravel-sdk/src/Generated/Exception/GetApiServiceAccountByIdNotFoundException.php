<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiServiceAccountByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse404
     */
    private $apiServiceAccountsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse404 $apiServiceAccountsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdGetResponse404 = $apiServiceAccountsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse404
    {
        return $this->apiServiceAccountsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}