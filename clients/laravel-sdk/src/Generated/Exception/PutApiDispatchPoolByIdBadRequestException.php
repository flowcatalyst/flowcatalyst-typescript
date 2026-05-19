<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiDispatchPoolByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse400
     */
    private $apiDispatchPoolsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse400 $apiDispatchPoolsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchPoolsIdPutResponse400 = $apiDispatchPoolsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiDispatchPoolsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse400
    {
        return $this->apiDispatchPoolsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}