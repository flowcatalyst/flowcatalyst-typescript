<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdAdditionalClientBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse400
     */
    private $apiAuthConfigsIdAdditionalClientsPutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse400 $apiAuthConfigsIdAdditionalClientsPutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdAdditionalClientsPutResponse400 = $apiAuthConfigsIdAdditionalClientsPutResponse400;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdAdditionalClientsPutResponse400(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse400
    {
        return $this->apiAuthConfigsIdAdditionalClientsPutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}