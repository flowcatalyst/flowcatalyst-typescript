<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiProcessByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse404
     */
    private $apiProcessesIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse404 $apiProcessesIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesIdGetResponse404 = $apiProcessesIdGetResponse404;
        $this->response = $response;
    }
    public function getApiProcessesIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse404
    {
        return $this->apiProcessesIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}