<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiServiceAccountByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse400
     */
    private $apiServiceAccountsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse400 $apiServiceAccountsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdPutResponse400 = $apiServiceAccountsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse400
    {
        return $this->apiServiceAccountsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}