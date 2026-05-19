<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiPrincipalByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeleteResponse404
     */
    private $apiPrincipalsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdDeleteResponse404 $apiPrincipalsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdDeleteResponse404 = $apiPrincipalsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeleteResponse404
    {
        return $this->apiPrincipalsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}