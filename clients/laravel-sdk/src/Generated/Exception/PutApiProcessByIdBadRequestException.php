<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiProcessByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse400
     */
    private $apiProcessesIdPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse400 $apiProcessesIdPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesIdPutResponse400 = $apiProcessesIdPutResponse400;
        $this->response = $response;
    }
    public function getApiProcessesIdPutResponse400(): \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse400
    {
        return $this->apiProcessesIdPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}