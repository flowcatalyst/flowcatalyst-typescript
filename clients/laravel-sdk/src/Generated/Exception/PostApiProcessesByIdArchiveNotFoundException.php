<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiProcessesByIdArchiveNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesIdArchivePostResponse404
     */
    private $apiProcessesIdArchivePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesIdArchivePostResponse404 $apiProcessesIdArchivePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesIdArchivePostResponse404 = $apiProcessesIdArchivePostResponse404;
        $this->response = $response;
    }
    public function getApiProcessesIdArchivePostResponse404(): \FlowCatalyst\Generated\Model\ApiProcessesIdArchivePostResponse404
    {
        return $this->apiProcessesIdArchivePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}