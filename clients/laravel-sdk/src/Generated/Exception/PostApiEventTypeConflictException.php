<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypeConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse409
     */
    private $apiEventTypesPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesPostResponse409 $apiEventTypesPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesPostResponse409 = $apiEventTypesPostResponse409;
        $this->response = $response;
    }
    public function getApiEventTypesPostResponse409(): \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse409
    {
        return $this->apiEventTypesPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}