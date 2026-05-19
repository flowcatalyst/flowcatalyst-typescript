<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiRolesBySourceBySourceBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse400
     */
    private $apiRolesBySourceSourceGetResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse400 $apiRolesBySourceSourceGetResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiRolesBySourceSourceGetResponse400 = $apiRolesBySourceSourceGetResponse400;
        $this->response = $response;
    }
    public function getApiRolesBySourceSourceGetResponse400(): \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse400
    {
        return $this->apiRolesBySourceSourceGetResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}