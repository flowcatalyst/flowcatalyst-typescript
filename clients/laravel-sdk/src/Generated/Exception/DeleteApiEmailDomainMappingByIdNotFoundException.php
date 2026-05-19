<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiEmailDomainMappingByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdDeleteResponse404
     */
    private $apiEmailDomainMappingsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdDeleteResponse404 $apiEmailDomainMappingsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsIdDeleteResponse404 = $apiEmailDomainMappingsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdDeleteResponse404
    {
        return $this->apiEmailDomainMappingsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}