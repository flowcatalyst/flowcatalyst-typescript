<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiRoleConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesPostResponse409
     */
    private $apiRolesPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesPostResponse409 $apiRolesPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesPostResponse409 = $apiRolesPostResponse409;
        $this->response = $response;
    }
    public function getApiRolesPostResponse409(): \FlowCatalyst\Generated\Model\ApiRolesPostResponse409
    {
        return $this->apiRolesPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}