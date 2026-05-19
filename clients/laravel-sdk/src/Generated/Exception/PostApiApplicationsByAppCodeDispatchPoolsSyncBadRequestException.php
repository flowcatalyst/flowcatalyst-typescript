<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByAppCodeDispatchPoolsSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse400
     */
    private $apiApplicationsAppCodeDispatchPoolsSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse400 $apiApplicationsAppCodeDispatchPoolsSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsAppCodeDispatchPoolsSyncPostResponse400 = $apiApplicationsAppCodeDispatchPoolsSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsAppCodeDispatchPoolsSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse400
    {
        return $this->apiApplicationsAppCodeDispatchPoolsSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}