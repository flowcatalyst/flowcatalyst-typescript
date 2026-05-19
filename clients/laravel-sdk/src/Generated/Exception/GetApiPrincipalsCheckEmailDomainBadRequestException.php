<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiPrincipalsCheckEmailDomainBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse400
     */
    private $apiPrincipalsCheckEmailDomainGetResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse400 $apiPrincipalsCheckEmailDomainGetResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsCheckEmailDomainGetResponse400 = $apiPrincipalsCheckEmailDomainGetResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsCheckEmailDomainGetResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse400
    {
        return $this->apiPrincipalsCheckEmailDomainGetResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}