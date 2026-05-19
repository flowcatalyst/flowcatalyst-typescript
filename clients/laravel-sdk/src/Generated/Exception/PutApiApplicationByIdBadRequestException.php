<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiApplicationByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse400
     */
    private $apiApplicationsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse400 $apiApplicationsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdPutResponse400 = $apiApplicationsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse400
    {
        return $this->apiApplicationsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}