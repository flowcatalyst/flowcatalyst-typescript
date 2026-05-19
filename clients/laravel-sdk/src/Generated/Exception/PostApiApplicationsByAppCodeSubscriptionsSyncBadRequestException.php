<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByAppCodeSubscriptionsSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400
     */
    private $apiApplicationsAppCodeSubscriptionsSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400 $apiApplicationsAppCodeSubscriptionsSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsAppCodeSubscriptionsSyncPostResponse400 = $apiApplicationsAppCodeSubscriptionsSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsAppCodeSubscriptionsSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400
    {
        return $this->apiApplicationsAppCodeSubscriptionsSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}