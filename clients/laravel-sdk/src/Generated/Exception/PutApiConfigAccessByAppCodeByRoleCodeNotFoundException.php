<?php

namespace FlowCatalyst\Generated\Exception;

class PutApiConfigAccessByAppCodeByRoleCodeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse404
     */
    private $apiConfigAccessAppCodeRoleCodePutResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse404 $apiConfigAccessAppCodeRoleCodePutResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAccessAppCodeRoleCodePutResponse404 = $apiConfigAccessAppCodeRoleCodePutResponse404;
        $this->response = $response;
    }
    public function getApiConfigAccessAppCodeRoleCodePutResponse404(): \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse404
    {
        return $this->apiConfigAccessAppCodeRoleCodePutResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}