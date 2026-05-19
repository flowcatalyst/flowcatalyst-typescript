<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiPrincipalsByIdRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse404
     */
    private $apiPrincipalsIdRolesPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse404 $apiPrincipalsIdRolesPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdRolesPutResponse404 = $apiPrincipalsIdRolesPutResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdRolesPutResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse404
    {
        return $this->apiPrincipalsIdRolesPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}