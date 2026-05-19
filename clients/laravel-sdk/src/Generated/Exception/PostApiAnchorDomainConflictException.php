<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiAnchorDomainConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse409
     */
    private $apiAnchorDomainsPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse409 $apiAnchorDomainsPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAnchorDomainsPostResponse409 = $apiAnchorDomainsPostResponse409;
        $this->response = $response;
    }
    public function getApiAnchorDomainsPostResponse409(): \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse409
    {
        return $this->apiAnchorDomainsPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}