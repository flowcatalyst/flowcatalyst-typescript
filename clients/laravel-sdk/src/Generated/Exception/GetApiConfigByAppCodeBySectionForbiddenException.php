<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiConfigByAppCodeBySectionForbiddenException extends ForbiddenException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse403
     */
    private $apiConfigAppCodeSectionGetResponse403;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse403 $apiConfigAppCodeSectionGetResponse403, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionGetResponse403 = $apiConfigAppCodeSectionGetResponse403;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionGetResponse403(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse403
    {
        return $this->apiConfigAppCodeSectionGetResponse403;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}