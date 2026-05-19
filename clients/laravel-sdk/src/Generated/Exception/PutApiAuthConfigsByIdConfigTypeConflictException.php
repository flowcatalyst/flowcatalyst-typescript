<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiAuthConfigsByIdConfigTypeConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse409
     */
    private $apiAuthConfigsIdConfigTypePutResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse409 $apiAuthConfigsIdConfigTypePutResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdConfigTypePutResponse409 = $apiAuthConfigsIdConfigTypePutResponse409;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdConfigTypePutResponse409(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse409
    {
        return $this->apiAuthConfigsIdConfigTypePutResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}