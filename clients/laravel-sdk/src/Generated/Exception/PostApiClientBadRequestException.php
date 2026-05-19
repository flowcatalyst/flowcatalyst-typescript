<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsPostResponse400
     */
    private $apiClientsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsPostResponse400 $apiClientsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsPostResponse400 = $apiClientsPostResponse400;
        $this->response = $response;
    }
    public function getApiClientsPostResponse400(): \FlowCatalyst\Generated\Model\ApiClientsPostResponse400
    {
        return $this->apiClientsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}