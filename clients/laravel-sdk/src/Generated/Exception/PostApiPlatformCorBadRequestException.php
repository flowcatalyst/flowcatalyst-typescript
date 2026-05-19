<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPlatformCorBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse400
     */
    private $apiPlatformCorsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse400 $apiPlatformCorsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPlatformCorsPostResponse400 = $apiPlatformCorsPostResponse400;
        $this->response = $response;
    }
    public function getApiPlatformCorsPostResponse400(): \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse400
    {
        return $this->apiPlatformCorsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}