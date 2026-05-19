<?php

namespace FlowCatalyst\Generated\Exception;

class PatchApiScheduledJobByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse404
     */
    private $apiScheduledJobsIdPatchResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse404 $apiScheduledJobsIdPatchResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdPatchResponse404 = $apiScheduledJobsIdPatchResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdPatchResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse404
    {
        return $this->apiScheduledJobsIdPatchResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}