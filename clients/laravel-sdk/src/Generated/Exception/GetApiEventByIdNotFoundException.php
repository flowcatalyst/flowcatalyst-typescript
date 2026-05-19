<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiEventByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventsIdGetResponse404
     */
    private $apiEventsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventsIdGetResponse404 $apiEventsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventsIdGetResponse404 = $apiEventsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiEventsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiEventsIdGetResponse404
    {
        return $this->apiEventsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}