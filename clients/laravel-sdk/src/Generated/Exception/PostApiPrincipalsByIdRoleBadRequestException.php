<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdRoleBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse400
     */
    private $apiPrincipalsIdRolesPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse400 $apiPrincipalsIdRolesPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdRolesPostResponse400 = $apiPrincipalsIdRolesPostResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsIdRolesPostResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse400
    {
        return $this->apiPrincipalsIdRolesPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}