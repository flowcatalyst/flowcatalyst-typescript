<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByAppCodeRolesSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse400
     */
    private $apiApplicationsAppCodeRolesSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse400 $apiApplicationsAppCodeRolesSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsAppCodeRolesSyncPostResponse400 = $apiApplicationsAppCodeRolesSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsAppCodeRolesSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse400
    {
        return $this->apiApplicationsAppCodeRolesSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}