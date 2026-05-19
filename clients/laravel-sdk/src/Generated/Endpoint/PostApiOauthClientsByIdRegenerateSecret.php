<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiOauthClientsByIdRegenerateSecret extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $id;
    /**
     * @param string $id
     */
    public function __construct(string $id)
    {
        $this->id = $id;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'POST';
    }
    public function getUri(): string
    {
        return str_replace(['{id}'], [$this->id], '/api/oauth-clients/{id}/regenerate-secret');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        return [[], null];
    }
    public function getExtraHeaders(): array
    {
        return ['Accept' => ['application/json']];
    }
    /**
     * {@inheritdoc}
     *
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRegenerateSecretBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRegenerateSecretNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200', 'json');
        }
        if (is_null($contentType) === false && (400 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRegenerateSecretBadRequestException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse400', 'json'), $response);
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRegenerateSecretNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}