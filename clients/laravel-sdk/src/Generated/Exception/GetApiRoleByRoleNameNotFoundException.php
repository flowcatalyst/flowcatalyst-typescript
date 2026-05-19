<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiRoleByRoleNameNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse404
     */
    private $apiRolesRoleNameGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse404 $apiRolesRoleNameGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesRoleNameGetResponse404 = $apiRolesRoleNameGetResponse404;
        $this->response = $response;
    }
    public function getApiRolesRoleNameGetResponse404(): \FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse404
    {
        return $this->apiRolesRoleNameGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}