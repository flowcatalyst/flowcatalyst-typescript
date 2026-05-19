<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEmailDomainMappingBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse400
     */
    private $apiEmailDomainMappingsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse400 $apiEmailDomainMappingsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEmailDomainMappingsPostResponse400 = $apiEmailDomainMappingsPostResponse400;
        $this->response = $response;
    }
    public function getApiEmailDomainMappingsPostResponse400(): \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse400
    {
        return $this->apiEmailDomainMappingsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}