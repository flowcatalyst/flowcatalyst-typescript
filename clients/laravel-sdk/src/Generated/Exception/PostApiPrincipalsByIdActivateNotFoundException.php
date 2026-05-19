<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdActivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse404
     */
    private $apiPrincipalsIdActivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse404 $apiPrincipalsIdActivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdActivatePostResponse404 = $apiPrincipalsIdActivatePostResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdActivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse404
    {
        return $this->apiPrincipalsIdActivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}