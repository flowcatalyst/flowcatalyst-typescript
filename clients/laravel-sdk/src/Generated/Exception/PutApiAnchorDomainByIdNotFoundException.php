<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAnchorDomainByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse404
     */
    private $apiAnchorDomainsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse404 $apiAnchorDomainsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAnchorDomainsIdPutResponse404 = $apiAnchorDomainsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiAnchorDomainsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse404
    {
        return $this->apiAnchorDomainsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}