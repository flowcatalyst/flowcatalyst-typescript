<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiAuthConfigsOidcConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse409
     */
    private $apiAuthConfigsOidcPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse409 $apiAuthConfigsOidcPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsOidcPostResponse409 = $apiAuthConfigsOidcPostResponse409;
        $this->response = $response;
    }
    public function getApiAuthConfigsOidcPostResponse409(): \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse409
    {
        return $this->apiAuthConfigsOidcPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}