<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiRoleByRoleNameNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesRoleNameDeleteResponse404
     */
    private $apiRolesRoleNameDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesRoleNameDeleteResponse404 $apiRolesRoleNameDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesRoleNameDeleteResponse404 = $apiRolesRoleNameDeleteResponse404;
        $this->response = $response;
    }
    public function getApiRolesRoleNameDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiRolesRoleNameDeleteResponse404
    {
        return $this->apiRolesRoleNameDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}