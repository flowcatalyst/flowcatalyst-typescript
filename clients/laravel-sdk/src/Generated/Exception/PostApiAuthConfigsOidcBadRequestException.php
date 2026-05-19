<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiAuthConfigsOidcBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse400
     */
    private $apiAuthConfigsOidcPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse400 $apiAuthConfigsOidcPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiAuthConfigsOidcPostResponse400 = $apiAuthConfigsOidcPostResponse400;
        $this->response = $response;
    }
    public function getApiAuthConfigsOidcPostResponse400(): \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse400
    {
        return $this->apiAuthConfigsOidcPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}