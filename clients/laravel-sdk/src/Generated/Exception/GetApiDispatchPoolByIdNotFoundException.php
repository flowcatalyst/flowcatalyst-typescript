<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiDispatchPoolByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse404
     */
    private $apiDispatchPoolsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse404 $apiDispatchPoolsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsIdGetResponse404 = $apiDispatchPoolsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiDispatchPoolsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse404
    {
        return $this->apiDispatchPoolsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}