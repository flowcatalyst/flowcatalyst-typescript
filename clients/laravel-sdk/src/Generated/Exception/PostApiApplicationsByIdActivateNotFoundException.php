<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdActivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse404
     */
    private $apiApplicationsIdActivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse404 $apiApplicationsIdActivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdActivatePostResponse404 = $apiApplicationsIdActivatePostResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdActivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse404
    {
        return $this->apiApplicationsIdActivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}