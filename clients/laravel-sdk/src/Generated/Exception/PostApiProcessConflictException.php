<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiProcessConflictException extends ConflictException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiProcessesPostResponse409
     */
    private $apiProcessesPostResponse409;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiProcessesPostResponse409 $apiProcessesPostResponse409, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiProcessesPostResponse409 = $apiProcessesPostResponse409;
        $this->response = $response;
    }
    public function getApiProcessesPostResponse409(): \FlowCatalyst\Generated\Model\ApiProcessesPostResponse409
    {
        return $this->apiProcessesPostResponse409;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}