<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdApplicationsByApplicationIdEnableNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse404
     */
    private $apiClientsIdApplicationsApplicationIdEnablePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse404 $apiClientsIdApplicationsApplicationIdEnablePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdApplicationsApplicationIdEnablePostResponse404 = $apiClientsIdApplicationsApplicationIdEnablePostResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdApplicationsApplicationIdEnablePostResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse404
    {
        return $this->apiClientsIdApplicationsApplicationIdEnablePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}