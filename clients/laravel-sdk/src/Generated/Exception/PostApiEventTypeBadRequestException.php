<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypeBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse400
     */
    private $apiEventTypesPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesPostResponse400 $apiEventTypesPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesPostResponse400 = $apiEventTypesPostResponse400;
        $this->response = $response;
    }
    public function getApiEventTypesPostResponse400(): \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse400
    {
        return $this->apiEventTypesPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}