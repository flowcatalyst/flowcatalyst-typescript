<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiAuthConfigsInternalConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse409
     */
    private $apiAuthConfigsInternalPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse409 $apiAuthConfigsInternalPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsInternalPostResponse409 = $apiAuthConfigsInternalPostResponse409;
        $this->response = $response;
    }
    public function getApiAuthConfigsInternalPostResponse409(): \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse409
    {
        return $this->apiAuthConfigsInternalPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}