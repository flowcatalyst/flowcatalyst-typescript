<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiPrincipalsUserConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse409
     */
    private $apiPrincipalsUsersPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse409 $apiPrincipalsUsersPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiPrincipalsUsersPostResponse409 = $apiPrincipalsUsersPostResponse409;
        $this->response = $response;
    }
    public function getApiPrincipalsUsersPostResponse409(): \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse409
    {
        return $this->apiPrincipalsUsersPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}