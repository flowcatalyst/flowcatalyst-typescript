<?php

namespace FlowCatalyst\Generated\Exception;

class PostApiClientsByIdNoteNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse404
     */
    private $apiClientsIdNotesPostResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse404 $apiClientsIdNotesPostResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiClientsIdNotesPostResponse404 = $apiClientsIdNotesPostResponse404;
        $this->response = $response;
    }
    public function getApiClientsIdNotesPostResponse404(): \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse404
    {
        return $this->apiClientsIdNotesPostResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}