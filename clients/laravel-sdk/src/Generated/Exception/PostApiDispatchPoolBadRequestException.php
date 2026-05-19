<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiDispatchPoolBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse400
     */
    private $apiDispatchPoolsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse400 $apiDispatchPoolsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsPostResponse400 = $apiDispatchPoolsPostResponse400;
        $this->response = $response;
    }
    public function getApiDispatchPoolsPostResponse400(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse400
    {
        return $this->apiDispatchPoolsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}