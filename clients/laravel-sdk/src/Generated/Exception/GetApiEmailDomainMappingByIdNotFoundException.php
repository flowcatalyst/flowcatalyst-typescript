<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiEmailDomainMappingByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse404
     */
    private $apiEmailDomainMappingsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse404 $apiEmailDomainMappingsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsIdGetResponse404 = $apiEmailDomainMappingsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse404
    {
        return $this->apiEmailDomainMappingsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}