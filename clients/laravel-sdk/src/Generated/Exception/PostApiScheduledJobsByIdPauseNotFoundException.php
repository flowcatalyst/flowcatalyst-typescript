<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdPauseNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse404
     */
    private $apiScheduledJobsIdPausePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse404 $apiScheduledJobsIdPausePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdPausePostResponse404 = $apiScheduledJobsIdPausePostResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdPausePostResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse404
    {
        return $this->apiScheduledJobsIdPausePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}