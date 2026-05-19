<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiSubscriptionByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse404
     */
    private $apiSubscriptionsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse404 $apiSubscriptionsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsIdGetResponse404 = $apiSubscriptionsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiSubscriptionsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse404
    {
        return $this->apiSubscriptionsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}