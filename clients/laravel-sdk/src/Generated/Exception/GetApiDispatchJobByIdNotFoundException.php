<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiDispatchJobByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse404
     */
    private $apiDispatchJobsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse404 $apiDispatchJobsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiDispatchJobsIdGetResponse404 = $apiDispatchJobsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiDispatchJobsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse404
    {
        return $this->apiDispatchJobsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}