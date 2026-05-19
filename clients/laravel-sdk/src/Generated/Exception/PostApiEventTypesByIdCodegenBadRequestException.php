<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiEventTypesByIdCodegenBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse400
     */
    private $apiEventTypesIdCodegenPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse400 $apiEventTypesIdCodegenPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiEventTypesIdCodegenPostResponse400 = $apiEventTypesIdCodegenPostResponse400;
        $this->response = $response;
    }
    public function getApiEventTypesIdCodegenPostResponse400(): \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse400
    {
        return $this->apiEventTypesIdCodegenPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}