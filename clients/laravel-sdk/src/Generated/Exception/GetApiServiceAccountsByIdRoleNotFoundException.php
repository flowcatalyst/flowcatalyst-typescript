<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiServiceAccountsByIdRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse404
     */
    private $apiServiceAccountsIdRolesGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse404 $apiServiceAccountsIdRolesGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRolesGetResponse404 = $apiServiceAccountsIdRolesGetResponse404;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRolesGetResponse404(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse404
    {
        return $this->apiServiceAccountsIdRolesGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}