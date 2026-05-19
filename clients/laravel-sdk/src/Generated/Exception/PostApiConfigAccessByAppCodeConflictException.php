<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiConfigAccessByAppCodeConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse409
     */
    private $apiConfigAccessAppCodePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse409 $apiConfigAccessAppCodePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAccessAppCodePostResponse409 = $apiConfigAccessAppCodePostResponse409;
        $this->response = $response;
    }
    public function getApiConfigAccessAppCodePostResponse409(): \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse409
    {
        return $this->apiConfigAccessAppCodePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}