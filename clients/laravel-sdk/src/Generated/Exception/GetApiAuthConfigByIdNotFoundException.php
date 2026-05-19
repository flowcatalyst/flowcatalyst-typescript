<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiAuthConfigByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse404
     */
    private $apiAuthConfigsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse404 $apiAuthConfigsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsIdGetResponse404 = $apiAuthConfigsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse404
    {
        return $this->apiAuthConfigsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}