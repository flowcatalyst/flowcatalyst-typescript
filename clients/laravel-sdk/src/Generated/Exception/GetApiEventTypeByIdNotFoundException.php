<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiEventTypeByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse404
     */
    private $apiEventTypesIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse404 $apiEventTypesIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdGetResponse404 = $apiEventTypesIdGetResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse404
    {
        return $this->apiEventTypesIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}