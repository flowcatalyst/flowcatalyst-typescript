<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdFireConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse409
     */
    private $apiScheduledJobsIdFirePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse409 $apiScheduledJobsIdFirePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdFirePostResponse409 = $apiScheduledJobsIdFirePostResponse409;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdFirePostResponse409(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse409
    {
        return $this->apiScheduledJobsIdFirePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}