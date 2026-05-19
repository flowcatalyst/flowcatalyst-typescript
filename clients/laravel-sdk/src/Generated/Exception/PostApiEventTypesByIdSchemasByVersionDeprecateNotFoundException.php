<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdSchemasByVersionDeprecateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse404
     */
    private $apiEventTypesIdSchemasVersionDeprecatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse404 $apiEventTypesIdSchemasVersionDeprecatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdSchemasVersionDeprecatePostResponse404 = $apiEventTypesIdSchemasVersionDeprecatePostResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdSchemasVersionDeprecatePostResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse404
    {
        return $this->apiEventTypesIdSchemasVersionDeprecatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}