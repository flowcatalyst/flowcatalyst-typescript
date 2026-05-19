<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdResetPasswordBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse400
     */
    private $apiPrincipalsIdResetPasswordPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse400 $apiPrincipalsIdResetPasswordPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdResetPasswordPostResponse400 = $apiPrincipalsIdResetPasswordPostResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsIdResetPasswordPostResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse400
    {
        return $this->apiPrincipalsIdResetPasswordPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}