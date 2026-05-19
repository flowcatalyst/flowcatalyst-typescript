<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiSubscriptionByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsIdDeleteResponse404
     */
    private $apiSubscriptionsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsIdDeleteResponse404 $apiSubscriptionsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsIdDeleteResponse404 = $apiSubscriptionsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiSubscriptionsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiSubscriptionsIdDeleteResponse404
    {
        return $this->apiSubscriptionsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}