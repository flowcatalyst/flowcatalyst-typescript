<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdArchiveConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse409
     */
    private $apiScheduledJobsIdArchivePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse409 $apiScheduledJobsIdArchivePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdArchivePostResponse409 = $apiScheduledJobsIdArchivePostResponse409;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdArchivePostResponse409(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse409
    {
        return $this->apiScheduledJobsIdArchivePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}