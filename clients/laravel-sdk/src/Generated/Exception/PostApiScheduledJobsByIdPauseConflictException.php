<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdPauseConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse409
     */
    private $apiScheduledJobsIdPausePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse409 $apiScheduledJobsIdPausePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdPausePostResponse409 = $apiScheduledJobsIdPausePostResponse409;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdPausePostResponse409(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse409
    {
        return $this->apiScheduledJobsIdPausePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}