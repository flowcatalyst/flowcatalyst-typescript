<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsInstancesByInstanceIdCompleteNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404
     */
    private $apiScheduledJobsInstancesInstanceIdCompletePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404 $apiScheduledJobsInstancesInstanceIdCompletePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsInstancesInstanceIdCompletePostResponse404 = $apiScheduledJobsInstancesInstanceIdCompletePostResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsInstancesInstanceIdCompletePostResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404
    {
        return $this->apiScheduledJobsInstancesInstanceIdCompletePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}