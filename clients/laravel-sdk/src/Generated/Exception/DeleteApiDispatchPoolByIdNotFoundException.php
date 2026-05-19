<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiDispatchPoolByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdDeleteResponse404
     */
    private $apiDispatchPoolsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdDeleteResponse404 $apiDispatchPoolsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsIdDeleteResponse404 = $apiDispatchPoolsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiDispatchPoolsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdDeleteResponse404
    {
        return $this->apiDispatchPoolsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}