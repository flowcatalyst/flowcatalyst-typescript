<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsByIdFireNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse404
     */
    private $apiScheduledJobsIdFirePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse404 $apiScheduledJobsIdFirePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsIdFirePostResponse404 = $apiScheduledJobsIdFirePostResponse404;
        $this->response = $response;
    }
    public function getApiScheduledJobsIdFirePostResponse404(): \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse404
    {
        return $this->apiScheduledJobsIdFirePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}