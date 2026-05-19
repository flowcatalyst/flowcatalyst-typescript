<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiProcessBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesPostResponse400
     */
    private $apiProcessesPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesPostResponse400 $apiProcessesPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesPostResponse400 = $apiProcessesPostResponse400;
        $this->response = $response;
    }
    public function getApiProcessesPostResponse400(): \FlowCatalyst\Generated\Model\ApiProcessesPostResponse400
    {
        return $this->apiProcessesPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}