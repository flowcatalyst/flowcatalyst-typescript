<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiClientsByIdApplicationNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse404
     */
    private $apiClientsIdApplicationsGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse404 $apiClientsIdApplicationsGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdApplicationsGetResponse404 = $apiClientsIdApplicationsGetResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdApplicationsGetResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse404
    {
        return $this->apiClientsIdApplicationsGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}