<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdDeactivateConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse409
     */
    private $apiApplicationsIdDeactivatePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse409 $apiApplicationsIdDeactivatePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdDeactivatePostResponse409 = $apiApplicationsIdDeactivatePostResponse409;
        $this->response = $response;
    }
    public function getApiApplicationsIdDeactivatePostResponse409(): \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse409
    {
        return $this->apiApplicationsIdDeactivatePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}