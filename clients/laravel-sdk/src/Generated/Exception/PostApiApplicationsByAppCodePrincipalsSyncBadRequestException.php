<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByAppCodePrincipalsSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse400
     */
    private $apiApplicationsAppCodePrincipalsSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse400 $apiApplicationsAppCodePrincipalsSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsAppCodePrincipalsSyncPostResponse400 = $apiApplicationsAppCodePrincipalsSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsAppCodePrincipalsSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse400
    {
        return $this->apiApplicationsAppCodePrincipalsSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}