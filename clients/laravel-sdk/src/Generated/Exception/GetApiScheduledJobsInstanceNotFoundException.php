<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiScheduledJobsInstanceNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse404
     */
    private $apiScheduledJobsInstancesGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse404 $apiScheduledJobsInstancesGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsInstancesGetResponse404 = $apiScheduledJobsInstancesGetResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsInstancesGetResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse404
    {
        return $this->apiScheduledJobsInstancesGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}