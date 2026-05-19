<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiEmailDomainMappingByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse400
     */
    private $apiEmailDomainMappingsIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse400 $apiEmailDomainMappingsIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsIdPutResponse400 = $apiEmailDomainMappingsIdPutResponse400;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse400
    {
        return $this->apiEmailDomainMappingsIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}