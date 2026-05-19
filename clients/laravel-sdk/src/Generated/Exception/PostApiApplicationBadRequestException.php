<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse400
     */
    private $apiApplicationsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsPostResponse400 $apiApplicationsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsPostResponse400 = $apiApplicationsPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse400
    {
        return $this->apiApplicationsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}