<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdArchiveNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse404
     */
    private $apiEventTypesIdArchivePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse404 $apiEventTypesIdArchivePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdArchivePostResponse404 = $apiEventTypesIdArchivePostResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdArchivePostResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse404
    {
        return $this->apiEventTypesIdArchivePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}