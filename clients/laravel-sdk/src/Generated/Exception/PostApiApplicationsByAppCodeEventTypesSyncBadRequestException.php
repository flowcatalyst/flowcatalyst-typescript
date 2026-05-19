<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiApplicationsByAppCodeEventTypesSyncBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse400
     */
    private $apiApplicationsAppCodeEventTypesSyncPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse400 $apiApplicationsAppCodeEventTypesSyncPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiApplicationsAppCodeEventTypesSyncPostResponse400 = $apiApplicationsAppCodeEventTypesSyncPostResponse400;
        $this->response = $response;
    }
    public function getApiApplicationsAppCodeEventTypesSyncPostResponse400(): \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse400
    {
        return $this->apiApplicationsAppCodeEventTypesSyncPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}