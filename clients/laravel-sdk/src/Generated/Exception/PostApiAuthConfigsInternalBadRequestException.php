<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiAuthConfigsInternalBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse400
     */
    private $apiAuthConfigsInternalPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse400 $apiAuthConfigsInternalPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsInternalPostResponse400 = $apiAuthConfigsInternalPostResponse400;
        $this->response = $response;
    }
    public function getApiAuthConfigsInternalPostResponse400(): \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse400
    {
        return $this->apiAuthConfigsInternalPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}