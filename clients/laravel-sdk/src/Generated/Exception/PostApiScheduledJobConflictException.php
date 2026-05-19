<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse409
     */
    private $apiScheduledJobsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse409 $apiScheduledJobsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsPostResponse409 = $apiScheduledJobsPostResponse409;
        $this->response = $response;
    }
    public function getApiScheduledJobsPostResponse409(): \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse409
    {
        return $this->apiScheduledJobsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}