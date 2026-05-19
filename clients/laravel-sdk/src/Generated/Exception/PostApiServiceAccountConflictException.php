<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiServiceAccountConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse409
     */
    private $apiServiceAccountsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse409 $apiServiceAccountsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiServiceAccountsPostResponse409 = $apiServiceAccountsPostResponse409;
        $this->response = $response;
    }
    public function getApiServiceAccountsPostResponse409(): \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse409
    {
        return $this->apiServiceAccountsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}