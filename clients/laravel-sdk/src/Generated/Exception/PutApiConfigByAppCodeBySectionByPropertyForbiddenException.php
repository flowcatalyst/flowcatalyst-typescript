<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiConfigByAppCodeBySectionByPropertyForbiddenException extends ForbiddenException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse403
     */
    private $apiConfigAppCodeSectionPropertyPutResponse403;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse403 $apiConfigAppCodeSectionPropertyPutResponse403, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionPropertyPutResponse403 = $apiConfigAppCodeSectionPropertyPutResponse403;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionPropertyPutResponse403(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse403
    {
        return $this->apiConfigAppCodeSectionPropertyPutResponse403;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}