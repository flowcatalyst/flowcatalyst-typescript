<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiAuthConfigByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdDeleteResponse404
     */
    private $apiAuthConfigsIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdDeleteResponse404 $apiAuthConfigsIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdDeleteResponse404 = $apiAuthConfigsIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdDeleteResponse404
    {
        return $this->apiAuthConfigsIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}