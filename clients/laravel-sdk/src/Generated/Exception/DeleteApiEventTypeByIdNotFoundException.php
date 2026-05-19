<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiEventTypeByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdDeleteResponse404
     */
    private $apiEventTypesIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdDeleteResponse404 $apiEventTypesIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdDeleteResponse404 = $apiEventTypesIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdDeleteResponse404
    {
        return $this->apiEventTypesIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}