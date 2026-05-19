<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdActivateBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse400
     */
    private $apiClientsIdActivatePostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse400 $apiClientsIdActivatePostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdActivatePostResponse400 = $apiClientsIdActivatePostResponse400;
        $this->response = $response;
    }
    public function getApiClientsIdActivatePostResponse400(): \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse400
    {
        return $this->apiClientsIdActivatePostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}