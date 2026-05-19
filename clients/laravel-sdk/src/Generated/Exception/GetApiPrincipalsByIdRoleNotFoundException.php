<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPrincipalsByIdRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse404
     */
    private $apiPrincipalsIdRolesGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse404 $apiPrincipalsIdRolesGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdRolesGetResponse404 = $apiPrincipalsIdRolesGetResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdRolesGetResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse404
    {
        return $this->apiPrincipalsIdRolesGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}