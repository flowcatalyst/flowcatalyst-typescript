<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiEmailDomainMappingByIdConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse409
     */
    private $apiEmailDomainMappingsIdPutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse409 $apiEmailDomainMappingsIdPutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsIdPutResponse409 = $apiEmailDomainMappingsIdPutResponse409;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsIdPutResponse409(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse409
    {
        return $this->apiEmailDomainMappingsIdPutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}