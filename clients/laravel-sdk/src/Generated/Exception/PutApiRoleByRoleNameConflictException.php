<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiRoleByRoleNameConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse409
     */
    private $apiRolesRoleNamePutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse409 $apiRolesRoleNamePutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesRoleNamePutResponse409 = $apiRolesRoleNamePutResponse409;
        $this->response = $response;
    }
    public function getApiRolesRoleNamePutResponse409(): \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse409
    {
        return $this->apiRolesRoleNamePutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}