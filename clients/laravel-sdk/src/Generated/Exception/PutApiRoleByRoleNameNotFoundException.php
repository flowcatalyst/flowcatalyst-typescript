<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiRoleByRoleNameNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse404
     */
    private $apiRolesRoleNamePutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse404 $apiRolesRoleNamePutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesRoleNamePutResponse404 = $apiRolesRoleNamePutResponse404;
        $this->response = $response;
    }
    public function getApiRolesRoleNamePutResponse404(): \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse404
    {
        return $this->apiRolesRoleNamePutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}