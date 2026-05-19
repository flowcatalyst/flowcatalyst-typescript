<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiConfigAccessByAppCodeByRoleCodeNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodeDeleteResponse404
     */
    private $apiConfigAccessAppCodeRoleCodeDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodeDeleteResponse404 $apiConfigAccessAppCodeRoleCodeDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAccessAppCodeRoleCodeDeleteResponse404 = $apiConfigAccessAppCodeRoleCodeDeleteResponse404;
        $this->response = $response;
    }
    public function getApiConfigAccessAppCodeRoleCodeDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodeDeleteResponse404
    {
        return $this->apiConfigAccessAppCodeRoleCodeDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}