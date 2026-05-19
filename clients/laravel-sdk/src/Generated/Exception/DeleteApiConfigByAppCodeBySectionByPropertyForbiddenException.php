<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiConfigByAppCodeBySectionByPropertyForbiddenException extends ForbiddenException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse403
     */
    private $apiConfigAppCodeSectionPropertyDeleteResponse403;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse403 $apiConfigAppCodeSectionPropertyDeleteResponse403, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionPropertyDeleteResponse403 = $apiConfigAppCodeSectionPropertyDeleteResponse403;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionPropertyDeleteResponse403(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse403
    {
        return $this->apiConfigAppCodeSectionPropertyDeleteResponse403;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}