<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiConfigByAppCodeBySectionByPropertyNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse404
     */
    private $apiConfigAppCodeSectionPropertyDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse404 $apiConfigAppCodeSectionPropertyDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeSectionPropertyDeleteResponse404 = $apiConfigAppCodeSectionPropertyDeleteResponse404;
        $this->response = $response;
    }
    public function getApiConfigAppCodeSectionPropertyDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse404
    {
        return $this->apiConfigAppCodeSectionPropertyDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}