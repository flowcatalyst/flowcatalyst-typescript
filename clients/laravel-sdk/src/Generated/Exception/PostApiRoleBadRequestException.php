<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiRoleBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesPostResponse400
     */
    private $apiRolesPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesPostResponse400 $apiRolesPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesPostResponse400 = $apiRolesPostResponse400;
        $this->response = $response;
    }
    public function getApiRolesPostResponse400(): \FlowCatalyst\Generated\Model\ApiRolesPostResponse400
    {
        return $this->apiRolesPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}