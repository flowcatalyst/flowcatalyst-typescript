<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiSubscriptionBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse400
     */
    private $apiSubscriptionsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse400 $apiSubscriptionsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsPostResponse400 = $apiSubscriptionsPostResponse400;
        $this->response = $response;
    }
    public function getApiSubscriptionsPostResponse400(): \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse400
    {
        return $this->apiSubscriptionsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}