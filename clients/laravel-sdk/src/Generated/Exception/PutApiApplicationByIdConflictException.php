<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiApplicationByIdConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse409
     */
    private $apiApplicationsIdPutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse409 $apiApplicationsIdPutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdPutResponse409 = $apiApplicationsIdPutResponse409;
        $this->response = $response;
    }
    public function getApiApplicationsIdPutResponse409(): \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse409
    {
        return $this->apiApplicationsIdPutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}