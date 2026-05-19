<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPlatformCorConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse409
     */
    private $apiPlatformCorsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse409 $apiPlatformCorsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPlatformCorsPostResponse409 = $apiPlatformCorsPostResponse409;
        $this->response = $response;
    }
    public function getApiPlatformCorsPostResponse409(): \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse409
    {
        return $this->apiPlatformCorsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}