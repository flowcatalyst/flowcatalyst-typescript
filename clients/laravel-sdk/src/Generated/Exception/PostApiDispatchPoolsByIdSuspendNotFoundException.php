<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiDispatchPoolsByIdSuspendNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse404
     */
    private $apiDispatchPoolsIdSuspendPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse404 $apiDispatchPoolsIdSuspendPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsIdSuspendPostResponse404 = $apiDispatchPoolsIdSuspendPostResponse404;
        $this->response = $response;
    }
    public function getApiDispatchPoolsIdSuspendPostResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse404
    {
        return $this->apiDispatchPoolsIdSuspendPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}