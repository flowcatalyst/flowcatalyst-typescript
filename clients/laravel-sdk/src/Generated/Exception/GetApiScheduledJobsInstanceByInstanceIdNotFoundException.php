<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiScheduledJobsInstanceByInstanceIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse404
     */
    private $apiScheduledJobsInstancesInstanceIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse404 $apiScheduledJobsInstancesInstanceIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsInstancesInstanceIdGetResponse404 = $apiScheduledJobsInstancesInstanceIdGetResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsInstancesInstanceIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse404
    {
        return $this->apiScheduledJobsInstancesInstanceIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}