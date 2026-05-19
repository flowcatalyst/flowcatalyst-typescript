<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiProcessByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse404
     */
    private $apiProcessesIdPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse404 $apiProcessesIdPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesIdPutResponse404 = $apiProcessesIdPutResponse404;
        $this->response = $response;
    }
    public function getApiProcessesIdPutResponse404(): \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse404
    {
        return $this->apiProcessesIdPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}