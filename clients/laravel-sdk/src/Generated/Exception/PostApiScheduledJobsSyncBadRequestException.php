<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiScheduledJobsSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse400
     */
    private $apiScheduledJobsSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse400 $apiScheduledJobsSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiScheduledJobsSyncPostResponse400 = $apiScheduledJobsSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiScheduledJobsSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse400
    {
        return $this->apiScheduledJobsSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}