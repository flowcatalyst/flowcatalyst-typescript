<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse400
     */
    private $apiEventTypesSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse400 $apiEventTypesSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesSyncPostResponse400 = $apiEventTypesSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiEventTypesSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse400
    {
        return $this->apiEventTypesSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}