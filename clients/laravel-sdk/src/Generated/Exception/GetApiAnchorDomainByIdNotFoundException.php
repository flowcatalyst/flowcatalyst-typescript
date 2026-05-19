<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiAnchorDomainByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse404
     */
    private $apiAnchorDomainsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse404 $apiAnchorDomainsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAnchorDomainsIdGetResponse404 = $apiAnchorDomainsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiAnchorDomainsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse404
    {
        return $this->apiAnchorDomainsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}