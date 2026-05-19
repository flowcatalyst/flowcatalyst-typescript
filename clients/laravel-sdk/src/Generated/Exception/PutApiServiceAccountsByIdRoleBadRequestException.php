<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiServiceAccountsByIdRoleBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse400
     */
    private $apiServiceAccountsIdRolesPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse400 $apiServiceAccountsIdRolesPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdRolesPutResponse400 = $apiServiceAccountsIdRolesPutResponse400;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdRolesPutResponse400(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse400
    {
        return $this->apiServiceAccountsIdRolesPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}