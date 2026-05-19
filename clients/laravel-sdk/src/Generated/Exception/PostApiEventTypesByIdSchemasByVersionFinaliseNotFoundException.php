<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdSchemasByVersionFinaliseNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse404
     */
    private $apiEventTypesIdSchemasVersionFinalisePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse404 $apiEventTypesIdSchemasVersionFinalisePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdSchemasVersionFinalisePostResponse404 = $apiEventTypesIdSchemasVersionFinalisePostResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdSchemasVersionFinalisePostResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse404
    {
        return $this->apiEventTypesIdSchemasVersionFinalisePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}