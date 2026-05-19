<?php

namespace FlowCatalyst\Generated\Exception;

class PatchApiEventTypeByIdBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse400
     */
    private $apiEventTypesIdPatchResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse400 $apiEventTypesIdPatchResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdPatchResponse400 = $apiEventTypesIdPatchResponse400;
        $this->response = $response;
    }
    public function getApiEventTypesIdPatchResponse400(): \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse400
    {
        return $this->apiEventTypesIdPatchResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}