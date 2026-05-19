<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdResumeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse404
     */
    private $apiScheduledJobsIdResumePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse404 $apiScheduledJobsIdResumePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdResumePostResponse404 = $apiScheduledJobsIdResumePostResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdResumePostResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse404
    {
        return $this->apiScheduledJobsIdResumePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}