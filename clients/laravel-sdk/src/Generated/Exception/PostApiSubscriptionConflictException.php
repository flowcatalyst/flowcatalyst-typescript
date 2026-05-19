<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiSubscriptionConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse409
     */
    private $apiSubscriptionsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse409 $apiSubscriptionsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsPostResponse409 = $apiSubscriptionsPostResponse409;
        $this->response = $response;
    }
    public function getApiSubscriptionsPostResponse409(): \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse409
    {
        return $this->apiSubscriptionsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}