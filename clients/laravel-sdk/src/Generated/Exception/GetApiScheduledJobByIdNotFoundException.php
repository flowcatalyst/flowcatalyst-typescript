<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiScheduledJobByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse404
     */
    private $apiScheduledJobsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse404 $apiScheduledJobsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdGetResponse404 = $apiScheduledJobsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse404
    {
        return $this->apiScheduledJobsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}