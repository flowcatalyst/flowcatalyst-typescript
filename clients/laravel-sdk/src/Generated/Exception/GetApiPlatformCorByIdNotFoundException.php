<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPlatformCorByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse404
     */
    private $apiPlatformCorsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse404 $apiPlatformCorsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPlatformCorsIdGetResponse404 = $apiPlatformCorsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiPlatformCorsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse404
    {
        return $this->apiPlatformCorsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}