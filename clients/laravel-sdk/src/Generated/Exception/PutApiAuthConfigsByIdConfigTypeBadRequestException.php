<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdConfigTypeBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse400
     */
    private $apiAuthConfigsIdConfigTypePutResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse400 $apiAuthConfigsIdConfigTypePutResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdConfigTypePutResponse400 = $apiAuthConfigsIdConfigTypePutResponse400;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdConfigTypePutResponse400(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse400
    {
        return $this->apiAuthConfigsIdConfigTypePutResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}