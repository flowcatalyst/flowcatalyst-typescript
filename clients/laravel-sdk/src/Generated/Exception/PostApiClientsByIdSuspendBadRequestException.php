<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdSuspendBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse400
     */
    private $apiClientsIdSuspendPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse400 $apiClientsIdSuspendPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdSuspendPostResponse400 = $apiClientsIdSuspendPostResponse400;
        $this->response = $response;
    }
    public function getApiClientsIdSuspendPostResponse400(): \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse400
    {
        return $this->apiClientsIdSuspendPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}