<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiApplicationByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdDeleteResponse404
     */
    private $apiApplicationsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdDeleteResponse404 $apiApplicationsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdDeleteResponse404 = $apiApplicationsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdDeleteResponse404
    {
        return $this->apiApplicationsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}