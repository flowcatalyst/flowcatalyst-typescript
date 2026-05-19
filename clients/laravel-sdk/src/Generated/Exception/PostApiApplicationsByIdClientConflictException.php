<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdClientConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse409
     */
    private $apiApplicationsIdClientsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse409 $apiApplicationsIdClientsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdClientsPostResponse409 = $apiApplicationsIdClientsPostResponse409;
        $this->response = $response;
    }
    public function getApiApplicationsIdClientsPostResponse409(): \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse409
    {
        return $this->apiApplicationsIdClientsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}