<?php

namespace FlowCatalyst\Generated\Exception;

class PatchApiScheduledJobByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse400
     */
    private $apiScheduledJobsIdPatchResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse400 $apiScheduledJobsIdPatchResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdPatchResponse400 = $apiScheduledJobsIdPatchResponse400;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdPatchResponse400(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse400
    {
        return $this->apiScheduledJobsIdPatchResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}