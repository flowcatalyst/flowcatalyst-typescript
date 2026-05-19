<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdDeactivateNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse404
     */
    private $apiPrincipalsIdDeactivatePostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse404 $apiPrincipalsIdDeactivatePostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdDeactivatePostResponse404 = $apiPrincipalsIdDeactivatePostResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdDeactivatePostResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse404
    {
        return $this->apiPrincipalsIdDeactivatePostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}