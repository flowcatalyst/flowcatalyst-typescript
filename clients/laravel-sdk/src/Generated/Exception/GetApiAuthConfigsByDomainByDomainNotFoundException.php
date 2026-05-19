<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiAuthConfigsByDomainByDomainNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse404
     */
    private $apiAuthConfigsByDomainDomainGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse404 $apiAuthConfigsByDomainDomainGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsByDomainDomainGetResponse404 = $apiAuthConfigsByDomainDomainGetResponse404;
        $this->response = $response;
    }
    public function getApiAuthConfigsByDomainDomainGetResponse404(): \FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse404
    {
        return $this->apiAuthConfigsByDomainDomainGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}