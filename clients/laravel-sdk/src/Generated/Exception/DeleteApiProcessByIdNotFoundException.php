<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiProcessByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesIdDeleteResponse404
     */
    private $apiProcessesIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesIdDeleteResponse404 $apiProcessesIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesIdDeleteResponse404 = $apiProcessesIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiProcessesIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiProcessesIdDeleteResponse404
    {
        return $this->apiProcessesIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}