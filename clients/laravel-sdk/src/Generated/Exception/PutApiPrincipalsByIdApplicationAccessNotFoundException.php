<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiPrincipalsByIdApplicationAccessNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse404
     */
    private $apiPrincipalsIdApplicationAccessPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse404 $apiPrincipalsIdApplicationAccessPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdApplicationAccessPutResponse404 = $apiPrincipalsIdApplicationAccessPutResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdApplicationAccessPutResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse404
    {
        return $this->apiPrincipalsIdApplicationAccessPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}