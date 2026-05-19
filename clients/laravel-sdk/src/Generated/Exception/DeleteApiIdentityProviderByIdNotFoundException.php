<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiIdentityProviderByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdDeleteResponse404
     */
    private $apiIdentityProvidersIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdDeleteResponse404 $apiIdentityProvidersIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiIdentityProvidersIdDeleteResponse404 = $apiIdentityProvidersIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiIdentityProvidersIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdDeleteResponse404
    {
        return $this->apiIdentityProvidersIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}