<?php

namespace FlowCatalyst\Generated\Exception;

class GetApiOauthClientsByClientIdByClientIdNotFoundException extends NotFoundException
{
    /**
     * @var \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse404
     */
    private $apiOauthClientsByClientIdClientIdGetResponse404;
    /**
     * @var \Psr\Http\Message\ResponseInterface
     */
    private $response;
    public function __construct(\FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse404 $apiOauthClientsByClientIdClientIdGetResponse404, \Psr\Http\Message\ResponseInterface $response)
    {
        parent::__construct('Default Response');
        $this->apiOauthClientsByClientIdClientIdGetResponse404 = $apiOauthClientsByClientIdClientIdGetResponse404;
        $this->response = $response;
    }
    public function getApiOauthClientsByClientIdClientIdGetResponse404(): \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse404
    {
        return $this->apiOauthClientsByClientIdClientIdGetResponse404;
    }
    public function getResponse(): \Psr\Http\Message\ResponseInterface
    {
        return $this->response;
    }
}