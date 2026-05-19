<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiApplicationsByIdRoleNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse404
     */
    private $apiApplicationsIdRolesGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse404 $apiApplicationsIdRolesGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdRolesGetResponse404 = $apiApplicationsIdRolesGetResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdRolesGetResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse404
    {
        return $this->apiApplicationsIdRolesGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}