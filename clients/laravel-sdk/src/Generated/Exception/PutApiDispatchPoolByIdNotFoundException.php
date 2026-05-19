<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiDispatchPoolByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse404
     */
    private $apiDispatchPoolsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse404 $apiDispatchPoolsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsIdPutResponse404 = $apiDispatchPoolsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiDispatchPoolsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse404
    {
        return $this->apiDispatchPoolsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}