<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiConfigByAppCodeBySectionByPropertyForbiddenException extends ForbiddenException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse403
     */
    private $apiConfigAppCodeSectionPropertyGetResponse403;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse403 $apiConfigAppCodeSectionPropertyGetResponse403, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionPropertyGetResponse403 = $apiConfigAppCodeSectionPropertyGetResponse403;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionPropertyGetResponse403(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse403
    {
        return $this->apiConfigAppCodeSectionPropertyGetResponse403;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}