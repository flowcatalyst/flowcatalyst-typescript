<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiDispatchPoolsSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse400
     */
    private $apiDispatchPoolsSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse400 $apiDispatchPoolsSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsSyncPostResponse400 = $apiDispatchPoolsSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiDispatchPoolsSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse400
    {
        return $this->apiDispatchPoolsSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}