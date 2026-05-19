<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdOidcBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse400
     */
    private $apiAuthConfigsIdOidcPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse400 $apiAuthConfigsIdOidcPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdOidcPutResponse400 = $apiAuthConfigsIdOidcPutResponse400;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdOidcPutResponse400(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse400
    {
        return $this->apiAuthConfigsIdOidcPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}