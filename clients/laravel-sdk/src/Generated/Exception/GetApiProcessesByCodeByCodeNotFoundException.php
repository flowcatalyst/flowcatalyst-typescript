<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiProcessesByCodeByCodeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse404
     */
    private $apiProcessesByCodeCodeGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse404 $apiProcessesByCodeCodeGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesByCodeCodeGetResponse404 = $apiProcessesByCodeCodeGetResponse404;
        $this->response = $response;
    }
    public function getApiProcessesByCodeCodeGetResponse404(): \FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse404
    {
        return $this->apiProcessesByCodeCodeGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}