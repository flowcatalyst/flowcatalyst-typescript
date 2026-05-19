<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiDispatchPoolsByIdActivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse404
     */
    private $apiDispatchPoolsIdActivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse404 $apiDispatchPoolsIdActivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsIdActivatePostResponse404 = $apiDispatchPoolsIdActivatePostResponse404;
        $this->response = $response;
    }
    public function getApiDispatchPoolsIdActivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse404
    {
        return $this->apiDispatchPoolsIdActivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}