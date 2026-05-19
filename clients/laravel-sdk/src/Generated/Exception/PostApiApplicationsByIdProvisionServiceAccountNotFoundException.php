<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdProvisionServiceAccountNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse404
     */
    private $apiApplicationsIdProvisionServiceAccountPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse404 $apiApplicationsIdProvisionServiceAccountPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdProvisionServiceAccountPostResponse404 = $apiApplicationsIdProvisionServiceAccountPostResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdProvisionServiceAccountPostResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse404
    {
        return $this->apiApplicationsIdProvisionServiceAccountPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}