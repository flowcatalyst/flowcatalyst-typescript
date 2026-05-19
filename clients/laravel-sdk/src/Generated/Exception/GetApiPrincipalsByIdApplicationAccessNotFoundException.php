<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPrincipalsByIdApplicationAccessNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse404
     */
    private $apiPrincipalsIdApplicationAccessGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse404 $apiPrincipalsIdApplicationAccessGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdApplicationAccessGetResponse404 = $apiPrincipalsIdApplicationAccessGetResponse404;
        $this->response = $response;
    }
    public function getApiPrincipalsIdApplicationAccessGetResponse404(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse404
    {
        return $this->apiPrincipalsIdApplicationAccessGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}