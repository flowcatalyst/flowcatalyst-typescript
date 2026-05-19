<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiServiceAccountsByIdRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse404
     */
    private $apiServiceAccountsIdRolesPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse404 $apiServiceAccountsIdRolesPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRolesPutResponse404 = $apiServiceAccountsIdRolesPutResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRolesPutResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse404
    {
        return $this->apiServiceAccountsIdRolesPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}