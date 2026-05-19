<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdAdditionalClientNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse404
     */
    private $apiAuthConfigsIdAdditionalClientsPutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse404 $apiAuthConfigsIdAdditionalClientsPutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdAdditionalClientsPutResponse404 = $apiAuthConfigsIdAdditionalClientsPutResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdAdditionalClientsPutResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse404
    {
        return $this->apiAuthConfigsIdAdditionalClientsPutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}