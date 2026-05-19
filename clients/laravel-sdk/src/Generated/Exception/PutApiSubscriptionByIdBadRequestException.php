<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiSubscriptionByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse400
     */
    private $apiSubscriptionsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse400 $apiSubscriptionsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiSubscriptionsIdPutResponse400 = $apiSubscriptionsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiSubscriptionsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse400
    {
        return $this->apiSubscriptionsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}