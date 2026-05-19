<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiOauthClientBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse400
     */
    private $apiOauthClientsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse400 $apiOauthClientsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsPostResponse400 = $apiOauthClientsPostResponse400;
        $this->response = $response;
    }
    public function getApiOauthClientsPostResponse400(): \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse400
    {
        return $this->apiOauthClientsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}