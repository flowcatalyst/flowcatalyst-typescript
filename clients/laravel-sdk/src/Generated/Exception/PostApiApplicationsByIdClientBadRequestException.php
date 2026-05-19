<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdClientBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse400
     */
    private $apiApplicationsIdClientsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse400 $apiApplicationsIdClientsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdClientsPostResponse400 = $apiApplicationsIdClientsPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsIdClientsPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse400
    {
        return $this->apiApplicationsIdClientsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}