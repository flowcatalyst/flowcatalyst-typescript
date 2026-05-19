<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiClientsByIdentifierByIdentifierNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse404
     */
    private $apiClientsByIdentifierIdentifierGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse404 $apiClientsByIdentifierIdentifierGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsByIdentifierIdentifierGetResponse404 = $apiClientsByIdentifierIdentifierGetResponse404;
        $this->response = $response;
    }
    public function getApiClientsByIdentifierIdentifierGetResponse404(): \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse404
    {
        return $this->apiClientsByIdentifierIdentifierGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}