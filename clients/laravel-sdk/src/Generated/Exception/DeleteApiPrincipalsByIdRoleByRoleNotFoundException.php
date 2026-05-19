<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiPrincipalsByIdRoleByRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesRoleDeleteResponse404
     */
    private $apiPrincipalsIdRolesRoleDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesRoleDeleteResponse404 $apiPrincipalsIdRolesRoleDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdRolesRoleDeleteResponse404 = $apiPrincipalsIdRolesRoleDeleteResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdRolesRoleDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesRoleDeleteResponse404
    {
        return $this->apiPrincipalsIdRolesRoleDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}