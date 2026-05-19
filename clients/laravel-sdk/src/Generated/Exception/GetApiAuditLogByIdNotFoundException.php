<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiAuditLogByIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse404
     */
    private $apiAuditLogsIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse404 $apiAuditLogsIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuditLogsIdGetResponse404 = $apiAuditLogsIdGetResponse404;
        $this->response = $response;
    }
    public function getApiAuditLogsIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse404
    {
        return $this->apiAuditLogsIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}