<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdResetPasswordNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse404
     */
    private $apiPrincipalsIdResetPasswordPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse404 $apiPrincipalsIdResetPasswordPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdResetPasswordPostResponse404 = $apiPrincipalsIdResetPasswordPostResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdResetPasswordPostResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse404
    {
        return $this->apiPrincipalsIdResetPasswordPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}