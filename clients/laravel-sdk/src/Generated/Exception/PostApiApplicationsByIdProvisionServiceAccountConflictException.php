<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdProvisionServiceAccountConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse409
     */
    private $apiApplicationsIdProvisionServiceAccountPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse409 $apiApplicationsIdProvisionServiceAccountPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdProvisionServiceAccountPostResponse409 = $apiApplicationsIdProvisionServiceAccountPostResponse409;
        $this->response = $response;
    }
    public function getApiApplicationsIdProvisionServiceAccountPostResponse409(): \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse409
    {
        return $this->apiApplicationsIdProvisionServiceAccountPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}