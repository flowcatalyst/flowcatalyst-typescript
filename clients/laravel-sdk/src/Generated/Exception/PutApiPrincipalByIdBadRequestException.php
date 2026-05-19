<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiPrincipalByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse400
     */
    private $apiPrincipalsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse400 $apiPrincipalsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdPutResponse400 = $apiPrincipalsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse400
    {
        return $this->apiPrincipalsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}