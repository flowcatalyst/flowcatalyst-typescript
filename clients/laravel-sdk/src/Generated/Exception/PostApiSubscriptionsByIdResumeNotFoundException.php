<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiSubscriptionsByIdResumeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse404
     */
    private $apiSubscriptionsIdResumePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse404 $apiSubscriptionsIdResumePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsIdResumePostResponse404 = $apiSubscriptionsIdResumePostResponse404;
        $this->response = $response;
    }
    public function getApiSubscriptionsIdResumePostResponse404(): \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse404
    {
        return $this->apiSubscriptionsIdResumePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}