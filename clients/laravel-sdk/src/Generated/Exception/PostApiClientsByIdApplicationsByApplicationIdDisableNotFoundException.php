<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdApplicationsByApplicationIdDisableNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse404
     */
    private $apiClientsIdApplicationsApplicationIdDisablePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse404 $apiClientsIdApplicationsApplicationIdDisablePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdApplicationsApplicationIdDisablePostResponse404 = $apiClientsIdApplicationsApplicationIdDisablePostResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdApplicationsApplicationIdDisablePostResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse404
    {
        return $this->apiClientsIdApplicationsApplicationIdDisablePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}