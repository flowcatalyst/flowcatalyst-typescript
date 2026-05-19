<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiEmailDomainMappingByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse404
     */
    private $apiEmailDomainMappingsIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse404 $apiEmailDomainMappingsIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsIdPutResponse404 = $apiEmailDomainMappingsIdPutResponse404;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse404
    {
        return $this->apiEmailDomainMappingsIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}