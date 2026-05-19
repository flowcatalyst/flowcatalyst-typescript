<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiConfigByAppCodeBySectionByPropertyNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse404
     */
    private $apiConfigAppCodeSectionPropertyGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse404 $apiConfigAppCodeSectionPropertyGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionPropertyGetResponse404 = $apiConfigAppCodeSectionPropertyGetResponse404;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionPropertyGetResponse404(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse404
    {
        return $this->apiConfigAppCodeSectionPropertyGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}