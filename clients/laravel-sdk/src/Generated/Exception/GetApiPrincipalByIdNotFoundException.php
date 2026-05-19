<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPrincipalByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse404
     */
    private $apiPrincipalsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse404 $apiPrincipalsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdGetResponse404 = $apiPrincipalsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse404
    {
        return $this->apiPrincipalsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}