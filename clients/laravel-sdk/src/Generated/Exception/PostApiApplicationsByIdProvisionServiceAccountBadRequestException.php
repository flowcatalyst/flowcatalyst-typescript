<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdProvisionServiceAccountBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse400
     */
    private $apiApplicationsIdProvisionServiceAccountPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse400 $apiApplicationsIdProvisionServiceAccountPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdProvisionServiceAccountPostResponse400 = $apiApplicationsIdProvisionServiceAccountPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsIdProvisionServiceAccountPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse400
    {
        return $this->apiApplicationsIdProvisionServiceAccountPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}