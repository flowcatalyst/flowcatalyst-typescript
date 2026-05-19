<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPrincipalsByIdClientAccessNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse404
     */
    private $apiPrincipalsIdClientAccessGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse404 $apiPrincipalsIdClientAccessGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdClientAccessGetResponse404 = $apiPrincipalsIdClientAccessGetResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdClientAccessGetResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse404
    {
        return $this->apiPrincipalsIdClientAccessGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}