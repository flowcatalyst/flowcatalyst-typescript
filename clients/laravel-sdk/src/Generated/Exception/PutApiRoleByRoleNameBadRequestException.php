<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiRoleByRoleNameBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse400
     */
    private $apiRolesRoleNamePutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse400 $apiRolesRoleNamePutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesRoleNamePutResponse400 = $apiRolesRoleNamePutResponse400;
        $this->response = $response;
    }
    public function getApiRolesRoleNamePutResponse400(): \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse400
    {
        return $this->apiRolesRoleNamePutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}