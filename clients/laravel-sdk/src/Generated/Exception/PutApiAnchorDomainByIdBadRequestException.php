<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAnchorDomainByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse400
     */
    private $apiAnchorDomainsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse400 $apiAnchorDomainsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAnchorDomainsIdPutResponse400 = $apiAnchorDomainsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiAnchorDomainsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse400
    {
        return $this->apiAnchorDomainsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}