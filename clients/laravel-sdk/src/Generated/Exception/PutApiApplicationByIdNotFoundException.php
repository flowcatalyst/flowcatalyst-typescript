<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiApplicationByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse404
     */
    private $apiApplicationsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse404 $apiApplicationsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdPutResponse404 = $apiApplicationsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse404
    {
        return $this->apiApplicationsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}