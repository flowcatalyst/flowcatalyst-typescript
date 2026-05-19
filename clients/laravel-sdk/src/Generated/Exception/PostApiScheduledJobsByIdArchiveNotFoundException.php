<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdArchiveNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse404
     */
    private $apiScheduledJobsIdArchivePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse404 $apiScheduledJobsIdArchivePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdArchivePostResponse404 = $apiScheduledJobsIdArchivePostResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdArchivePostResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse404
    {
        return $this->apiScheduledJobsIdArchivePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}