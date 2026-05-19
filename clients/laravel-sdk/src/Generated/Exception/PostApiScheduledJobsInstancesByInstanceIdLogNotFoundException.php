<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsInstancesByInstanceIdLogNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse404
     */
    private $apiScheduledJobsInstancesInstanceIdLogPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse404 $apiScheduledJobsInstancesInstanceIdLogPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsInstancesInstanceIdLogPostResponse404 = $apiScheduledJobsInstancesInstanceIdLogPostResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsInstancesInstanceIdLogPostResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse404
    {
        return $this->apiScheduledJobsInstancesInstanceIdLogPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}