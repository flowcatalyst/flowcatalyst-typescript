<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdSchemaNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse404
     */
    private $apiEventTypesIdSchemasPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse404 $apiEventTypesIdSchemasPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdSchemasPostResponse404 = $apiEventTypesIdSchemasPostResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdSchemasPostResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse404
    {
        return $this->apiEventTypesIdSchemasPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}