<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiServiceAccountByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdDeleteResponse404
     */
    private $apiServiceAccountsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdDeleteResponse404 $apiServiceAccountsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdDeleteResponse404 = $apiServiceAccountsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdDeleteResponse404
    {
        return $this->apiServiceAccountsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}