<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiPrincipalsByIdRoleBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse400
     */
    private $apiPrincipalsIdRolesPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse400 $apiPrincipalsIdRolesPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdRolesPutResponse400 = $apiPrincipalsIdRolesPutResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsIdRolesPutResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse400
    {
        return $this->apiPrincipalsIdRolesPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}