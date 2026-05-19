<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiAnchorDomainByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdDeleteResponse404
     */
    private $apiAnchorDomainsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdDeleteResponse404 $apiAnchorDomainsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAnchorDomainsIdDeleteResponse404 = $apiAnchorDomainsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiAnchorDomainsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdDeleteResponse404
    {
        return $this->apiAnchorDomainsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}