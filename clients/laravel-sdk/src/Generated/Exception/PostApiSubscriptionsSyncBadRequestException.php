<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiSubscriptionsSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse400
     */
    private $apiSubscriptionsSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse400 $apiSubscriptionsSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsSyncPostResponse400 = $apiSubscriptionsSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiSubscriptionsSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse400
    {
        return $this->apiSubscriptionsSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}