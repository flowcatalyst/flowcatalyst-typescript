<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiPrincipalByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse404
     */
    private $apiPrincipalsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse404 $apiPrincipalsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdPutResponse404 = $apiPrincipalsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse404
    {
        return $this->apiPrincipalsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}