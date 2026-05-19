<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiConfigByAppCodeBySectionByPropertyBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse400
     */
    private $apiConfigAppCodeSectionPropertyPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse400 $apiConfigAppCodeSectionPropertyPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionPropertyPutResponse400 = $apiConfigAppCodeSectionPropertyPutResponse400;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionPropertyPutResponse400(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse400
    {
        return $this->apiConfigAppCodeSectionPropertyPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}