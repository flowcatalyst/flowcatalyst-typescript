<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdConfigTypeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse404
     */
    private $apiAuthConfigsIdConfigTypePutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse404 $apiAuthConfigsIdConfigTypePutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdConfigTypePutResponse404 = $apiAuthConfigsIdConfigTypePutResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdConfigTypePutResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse404
    {
        return $this->apiAuthConfigsIdConfigTypePutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}