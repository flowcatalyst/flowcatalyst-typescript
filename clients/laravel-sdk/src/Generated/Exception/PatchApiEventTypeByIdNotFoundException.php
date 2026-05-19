<?php

namespace FlowCatalyst\Generated\Exception;

class PatchApiEventTypeByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse404
     */
    private $apiEventTypesIdPatchResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse404 $apiEventTypesIdPatchResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdPatchResponse404 = $apiEventTypesIdPatchResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdPatchResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse404
    {
        return $this->apiEventTypesIdPatchResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}