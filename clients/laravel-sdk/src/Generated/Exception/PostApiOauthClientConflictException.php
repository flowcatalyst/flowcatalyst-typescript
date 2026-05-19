<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse409
     */
    private $apiOauthClientsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse409 $apiOauthClientsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsPostResponse409 = $apiOauthClientsPostResponse409;
        $this->response = $response;
    }
    public function getApiOauthClientsPostResponse409(): \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse409
    {
        return $this->apiOauthClientsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}