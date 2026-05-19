<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiDispatchPoolConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse409
     */
    private $apiDispatchPoolsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse409 $apiDispatchPoolsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsPostResponse409 = $apiDispatchPoolsPostResponse409;
        $this->response = $response;
    }
    public function getApiDispatchPoolsPostResponse409(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse409
    {
        return $this->apiDispatchPoolsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}