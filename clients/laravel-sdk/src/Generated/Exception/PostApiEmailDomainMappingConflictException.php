<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEmailDomainMappingConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse409
     */
    private $apiEmailDomainMappingsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse409 $apiEmailDomainMappingsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsPostResponse409 = $apiEmailDomainMappingsPostResponse409;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsPostResponse409(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse409
    {
        return $this->apiEmailDomainMappingsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}