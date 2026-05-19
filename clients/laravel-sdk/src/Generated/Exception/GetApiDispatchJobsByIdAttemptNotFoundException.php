<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiDispatchJobsByIdAttemptNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse404
     */
    private $apiDispatchJobsIdAttemptsGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse404 $apiDispatchJobsIdAttemptsGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchJobsIdAttemptsGetResponse404 = $apiDispatchJobsIdAttemptsGetResponse404;
        $this->response = $response;
    }
    public function getApiDispatchJobsIdAttemptsGetResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse404
    {
        return $this->apiDispatchJobsIdAttemptsGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}