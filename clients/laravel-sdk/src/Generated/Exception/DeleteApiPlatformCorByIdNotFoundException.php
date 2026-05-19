<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiPlatformCorByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPlatformCorsIdDeleteResponse404
     */
    private $apiPlatformCorsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPlatformCorsIdDeleteResponse404 $apiPlatformCorsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPlatformCorsIdDeleteResponse404 = $apiPlatformCorsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiPlatformCorsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiPlatformCorsIdDeleteResponse404
    {
        return $this->apiPlatformCorsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}