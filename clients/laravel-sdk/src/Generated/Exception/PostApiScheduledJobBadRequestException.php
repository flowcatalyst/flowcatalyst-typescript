<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse400
     */
    private $apiScheduledJobsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse400 $apiScheduledJobsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsPostResponse400 = $apiScheduledJobsPostResponse400;
        $this->response = $response;
    }
    public function getApiScheduledJobsPostResponse400(): \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse400
    {
        return $this->apiScheduledJobsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}