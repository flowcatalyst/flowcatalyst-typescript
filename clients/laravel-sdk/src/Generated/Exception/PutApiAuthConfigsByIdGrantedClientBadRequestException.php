<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdGrantedClientBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse400
     */
    private $apiAuthConfigsIdGrantedClientsPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse400 $apiAuthConfigsIdGrantedClientsPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdGrantedClientsPutResponse400 = $apiAuthConfigsIdGrantedClientsPutResponse400;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdGrantedClientsPutResponse400(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse400
    {
        return $this->apiAuthConfigsIdGrantedClientsPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}