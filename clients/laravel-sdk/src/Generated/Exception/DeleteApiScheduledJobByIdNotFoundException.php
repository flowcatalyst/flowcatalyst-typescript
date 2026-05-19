<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiScheduledJobByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdDeleteResponse404
     */
    private $apiScheduledJobsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdDeleteResponse404 $apiScheduledJobsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdDeleteResponse404 = $apiScheduledJobsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdDeleteResponse404
    {
        return $this->apiScheduledJobsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}