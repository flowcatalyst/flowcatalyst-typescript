<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdDeactivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse404
     */
    private $apiApplicationsIdDeactivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse404 $apiApplicationsIdDeactivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdDeactivatePostResponse404 = $apiApplicationsIdDeactivatePostResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdDeactivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse404
    {
        return $this->apiApplicationsIdDeactivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}