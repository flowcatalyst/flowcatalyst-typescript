<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiApplicationsByIdClientNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse404
     */
    private $apiApplicationsIdClientsGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse404 $apiApplicationsIdClientsGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdClientsGetResponse404 = $apiApplicationsIdClientsGetResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdClientsGetResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse404
    {
        return $this->apiApplicationsIdClientsGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}