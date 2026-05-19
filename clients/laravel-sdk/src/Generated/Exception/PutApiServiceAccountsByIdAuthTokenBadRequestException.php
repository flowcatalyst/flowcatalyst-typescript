<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiServiceAccountsByIdAuthTokenBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse400
     */
    private $apiServiceAccountsIdAuthTokenPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse400 $apiServiceAccountsIdAuthTokenPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsIdAuthTokenPutResponse400 = $apiServiceAccountsIdAuthTokenPutResponse400;
        $this->response = $response;
    }
    public function getApiServiceAccountsIdAuthTokenPutResponse400(): \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse400
    {
        return $this->apiServiceAccountsIdAuthTokenPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}