<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiApplicationByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse404
     */
    private $apiApplicationsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse404 $apiApplicationsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdGetResponse404 = $apiApplicationsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse404
    {
        return $this->apiApplicationsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}