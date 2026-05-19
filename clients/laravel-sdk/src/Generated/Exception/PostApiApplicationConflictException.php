<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse409
     */
    private $apiApplicationsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsPostResponse409 $apiApplicationsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsPostResponse409 = $apiApplicationsPostResponse409;
        $this->response = $response;
    }
    public function getApiApplicationsPostResponse409(): \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse409
    {
        return $this->apiApplicationsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}