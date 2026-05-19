<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdCodegenNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse404
     */
    private $apiEventTypesIdCodegenPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse404 $apiEventTypesIdCodegenPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdCodegenPostResponse404 = $apiEventTypesIdCodegenPostResponse404;
        $this->response = $response;
    }
    public function getApiEventTypesIdCodegenPostResponse404(): \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse404
    {
        return $this->apiEventTypesIdCodegenPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}