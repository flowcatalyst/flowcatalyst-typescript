<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByIdActivateConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse409
     */
    private $apiApplicationsIdActivatePostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse409 $apiApplicationsIdActivatePostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsIdActivatePostResponse409 = $apiApplicationsIdActivatePostResponse409;
        $this->response = $response;
    }
    public function getApiApplicationsIdActivatePostResponse409(): \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse409
    {
        return $this->apiApplicationsIdActivatePostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}