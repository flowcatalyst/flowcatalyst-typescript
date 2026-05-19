<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiEmailDomainMappingsLookupByDomainNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse404
     */
    private $apiEmailDomainMappingsLookupDomainGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse404 $apiEmailDomainMappingsLookupDomainGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsLookupDomainGetResponse404 = $apiEmailDomainMappingsLookupDomainGetResponse404;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsLookupDomainGetResponse404(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse404
    {
        return $this->apiEmailDomainMappingsLookupDomainGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}