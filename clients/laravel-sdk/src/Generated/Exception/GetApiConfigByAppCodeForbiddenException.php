<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiConfigByAppCodeForbiddenException extends ForbiddenException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse403
     */
    private $apiConfigAppCodeGetResponse403;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse403 $apiConfigAppCodeGetResponse403, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiConfigAppCodeGetResponse403 = $apiConfigAppCodeGetResponse403;
        $this->response = $response;
    }
    public function getApiConfigAppCodeGetResponse403(): \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse403
    {
        return $this->apiConfigAppCodeGetResponse403;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}