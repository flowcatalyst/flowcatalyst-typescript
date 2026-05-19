<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiRolesPermissionByPermissionNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse404
     */
    private $apiRolesPermissionsPermissionGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse404 $apiRolesPermissionsPermissionGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesPermissionsPermissionGetResponse404 = $apiRolesPermissionsPermissionGetResponse404;
        $this->response = $response;
    }
    public function getApiRolesPermissionsPermissionGetResponse404(): \FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse404
    {
        return $this->apiRolesPermissionsPermissionGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}