<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiApplicationsByCodeByCodeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse404
     */
    private $apiApplicationsByCodeCodeGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse404 $apiApplicationsByCodeCodeGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsByCodeCodeGetResponse404 = $apiApplicationsByCodeCodeGetResponse404;
        $this->response = $response;
    }
    public function getApiApplicationsByCodeCodeGetResponse404(): \FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse404
    {
        return $this->apiApplicationsByCodeCodeGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}