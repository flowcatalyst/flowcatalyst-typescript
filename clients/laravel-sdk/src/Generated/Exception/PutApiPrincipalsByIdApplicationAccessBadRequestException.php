<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiPrincipalsByIdApplicationAccessBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse400
     */
    private $apiPrincipalsIdApplicationAccessPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse400 $apiPrincipalsIdApplicationAccessPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdApplicationAccessPutResponse400 = $apiPrincipalsIdApplicationAccessPutResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsIdApplicationAccessPutResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse400
    {
        return $this->apiPrincipalsIdApplicationAccessPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}