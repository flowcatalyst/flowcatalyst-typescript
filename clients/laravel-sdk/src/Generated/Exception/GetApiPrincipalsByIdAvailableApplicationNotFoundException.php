<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPrincipalsByIdAvailableApplicationNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse404
     */
    private $apiPrincipalsIdAvailableApplicationsGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse404 $apiPrincipalsIdAvailableApplicationsGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdAvailableApplicationsGetResponse404 = $apiPrincipalsIdAvailableApplicationsGetResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdAvailableApplicationsGetResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse404
    {
        return $this->apiPrincipalsIdAvailableApplicationsGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}