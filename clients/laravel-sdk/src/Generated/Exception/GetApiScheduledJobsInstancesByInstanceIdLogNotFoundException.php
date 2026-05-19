<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiScheduledJobsInstancesByInstanceIdLogNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404
     */
    private $apiScheduledJobsInstancesInstanceIdLogsGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404 $apiScheduledJobsInstancesInstanceIdLogsGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsInstancesInstanceIdLogsGetResponse404 = $apiScheduledJobsInstancesInstanceIdLogsGetResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsInstancesInstanceIdLogsGetResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404
    {
        return $this->apiScheduledJobsInstancesInstanceIdLogsGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}