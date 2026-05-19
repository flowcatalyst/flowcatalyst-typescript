<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiSubscriptionByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse404
     */
    private $apiSubscriptionsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse404 $apiSubscriptionsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsIdPutResponse404 = $apiSubscriptionsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiSubscriptionsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse404
    {
        return $this->apiSubscriptionsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}