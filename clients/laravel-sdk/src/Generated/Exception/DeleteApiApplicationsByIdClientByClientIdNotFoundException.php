<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiApplicationsByIdClientByClientIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsClientIdDeleteResponse404
     */
    private $apiApplicationsIdClientsClientIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsClientIdDeleteResponse404 $apiApplicationsIdClientsClientIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdClientsClientIdDeleteResponse404 = $apiApplicationsIdClientsClientIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdClientsClientIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsClientIdDeleteResponse404
    {
        return $this->apiApplicationsIdClientsClientIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}