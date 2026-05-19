<?php

namespace FlowCatalyst\Generated\Exception;

class DeleteApiPrincipalsByIdClientAccessByClientIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessClientIdDeleteResponse404
     */
    private $apiPrincipalsIdClientAccessClientIdDeleteResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessClientIdDeleteResponse404 $apiPrincipalsIdClientAccessClientIdDeleteResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdClientAccessClientIdDeleteResponse404 = $apiPrincipalsIdClientAccessClientIdDeleteResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdClientAccessClientIdDeleteResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessClientIdDeleteResponse404
    {
        return $this->apiPrincipalsIdClientAccessClientIdDeleteResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}