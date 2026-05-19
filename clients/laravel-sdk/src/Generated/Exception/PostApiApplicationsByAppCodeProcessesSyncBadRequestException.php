<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByAppCodeProcessesSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse400
     */
    private $apiApplicationsAppCodeProcessesSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse400 $apiApplicationsAppCodeProcessesSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsAppCodeProcessesSyncPostResponse400 = $apiApplicationsAppCodeProcessesSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsAppCodeProcessesSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse400
    {
        return $this->apiApplicationsAppCodeProcessesSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}