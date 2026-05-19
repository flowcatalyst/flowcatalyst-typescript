<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdNoteBadRequestException extends BadRequestException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse400
     */
    private $apiClientsIdNotesPostResponse400;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse400 $apiClientsIdNotesPostResponse400, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdNotesPostResponse400 = $apiClientsIdNotesPostResponse400;
        $this->response = $response;
    }
    public function getApiClientsIdNotesPostResponse400(): \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse400
    {
        return $this->apiClientsIdNotesPostResponse400;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}