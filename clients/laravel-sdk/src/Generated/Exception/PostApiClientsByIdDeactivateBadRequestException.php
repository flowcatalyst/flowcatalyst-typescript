<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdDeactivateBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse400
     */
    private $apiClientsIdDeactivatePostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse400 $apiClientsIdDeactivatePostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdDeactivatePostResponse400 = $apiClientsIdDeactivatePostResponse400;
        $this->response = $response;
    }
    public function getApiClientsIdDeactivatePostResponse400(): \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse400
    {
        return $this->apiClientsIdDeactivatePostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}