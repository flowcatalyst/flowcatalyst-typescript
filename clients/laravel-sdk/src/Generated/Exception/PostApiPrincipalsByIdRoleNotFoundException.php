<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse404
     */
    private $apiPrincipalsIdRolesPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse404 $apiPrincipalsIdRolesPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdRolesPostResponse404 = $apiPrincipalsIdRolesPostResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdRolesPostResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse404
    {
        return $this->apiPrincipalsIdRolesPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}