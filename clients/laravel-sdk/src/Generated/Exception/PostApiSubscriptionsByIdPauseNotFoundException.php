<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiSubscriptionsByIdPauseNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse404
     */
    private $apiSubscriptionsIdPausePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse404 $apiSubscriptionsIdPausePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsIdPausePostResponse404 = $apiSubscriptionsIdPausePostResponse404;
        $this->response = $response;
    }
    public function getApiSubscriptionsIdPausePostResponse404(): \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse404
    {
        return $this->apiSubscriptionsIdPausePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}