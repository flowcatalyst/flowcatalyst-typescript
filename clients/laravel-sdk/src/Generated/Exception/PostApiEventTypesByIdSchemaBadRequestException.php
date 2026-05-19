<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdSchemaBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse400
     */
    private $apiEventTypesIdSchemasPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse400 $apiEventTypesIdSchemasPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdSchemasPostResponse400 = $apiEventTypesIdSchemasPostResponse400;
        $this->response = $response;
    }
    public function getApiEventTypesIdSchemasPostResponse400(): \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse400
    {
        return $this->apiEventTypesIdSchemasPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}