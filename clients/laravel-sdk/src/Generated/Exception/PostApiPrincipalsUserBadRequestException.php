<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsUserBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse400
     */
    private $apiPrincipalsUsersPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse400 $apiPrincipalsUsersPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsUsersPostResponse400 = $apiPrincipalsUsersPostResponse400;
        $this->response = $response;
    }
    public function getApiPrincipalsUsersPostResponse400(): \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse400
    {
        return $this->apiPrincipalsUsersPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}