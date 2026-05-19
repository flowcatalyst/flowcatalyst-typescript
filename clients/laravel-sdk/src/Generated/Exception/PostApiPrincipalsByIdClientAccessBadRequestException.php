<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsByIdClientAccessBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse400
     */
    private $apiPrincipalsIdClientAccessPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse400 $apiPrincipalsIdClientAccessPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsIdClientAccessPostResponse400 = $apiPrincipalsIdClientAccessPostResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsIdClientAccessPostResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse400
    {
        return $this->apiPrincipalsIdClientAccessPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}