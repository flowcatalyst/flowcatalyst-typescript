<?php

namespace FlowCatalyst\Generated\Endpoint;

class PutApiAuthConfigsByIdConfigType extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $id;
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody $requestBody
     */
    public function __construct(string $id, ?\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody $requestBody = null)
    {
        $this->id = $id;
        $this->body = $requestBody;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'PUT';
    }
    public function getUri(): string
    {
        return str_replace(['{id}'], [$this->id], '/api/auth-configs/{id}/config-type');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody) {
            return [['Content-Type' => ['application/json']], $serializer->serialize($this->body, 'json')];
        }
        return [[], null];
    }
    public function getExtraHeaders(): array
    {
        return ['Accept' => ['application/json']];
    }
    /**
     * {@inheritdoc}
     *
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeConflictException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse200', 'json');
        }
        if (is_null($contentType) === false && (400 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeBadRequestException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse400', 'json'), $response);
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse404', 'json'), $response);
        }
        if (is_null($contentType) === false && (409 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeConflictException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse409', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}