<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdResumeConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse409
     */
    private $apiScheduledJobsIdResumePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse409 $apiScheduledJobsIdResumePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdResumePostResponse409 = $apiScheduledJobsIdResumePostResponse409;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdResumePostResponse409(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse409
    {
        return $this->apiScheduledJobsIdResumePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}