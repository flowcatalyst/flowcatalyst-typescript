<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdClientAccessNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse404
     */
    private $apiPrincipalsIdClientAccessPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse404 $apiPrincipalsIdClientAccessPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdClientAccessPostResponse404 = $apiPrincipalsIdClientAccessPostResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdClientAccessPostResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse404
    {
        return $this->apiPrincipalsIdClientAccessPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}