<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdClientNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse404
     */
    private $apiApplicationsIdClientsPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse404 $apiApplicationsIdClientsPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdClientsPostResponse404 = $apiApplicationsIdClientsPostResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdClientsPostResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse404
    {
        return $this->apiApplicationsIdClientsPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}