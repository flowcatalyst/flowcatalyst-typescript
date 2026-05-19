<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiAnchorDomainBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse400
     */
    private $apiAnchorDomainsPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse400 $apiAnchorDomainsPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAnchorDomainsPostResponse400 = $apiAnchorDomainsPostResponse400;
        $this->response = $response;
    }
    public function getApiAnchorDomainsPostResponse400(): \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse400
    {
        return $this->apiAnchorDomainsPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}