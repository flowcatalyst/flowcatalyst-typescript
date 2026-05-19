<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiServiceAccountBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse400
     */
    private $apiServiceAccountsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse400 $apiServiceAccountsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsPostResponse400 = $apiServiceAccountsPostResponse400;
        $this->response = $response;
    }
    public function getApiServiceAccountsPostResponse400(): \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse400
    {
        return $this->apiServiceAccountsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}