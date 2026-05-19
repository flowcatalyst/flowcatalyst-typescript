<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdClientAccessConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse409
     */
    private $apiPrincipalsIdClientAccessPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse409 $apiPrincipalsIdClientAccessPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdClientAccessPostResponse409 = $apiPrincipalsIdClientAccessPostResponse409;
        $this->response = $response;
    }
    public function getApiPrincipalsIdClientAccessPostResponse409(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse409
    {
        return $this->apiPrincipalsIdClientAccessPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}