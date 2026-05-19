<?php

namespace FlowCatalyst\Generated\Endpoint;

class PutApiRoleByRoleName extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $roleName;
    /**
     * @param string $roleName
     * @param null|\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody $requestBody
     */
    public function __construct(string $roleName, ?\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody $requestBody = null)
    {
        $this->roleName = $roleName;
        $this->body = $requestBody;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'PUT';
    }
    public function getUri(): string
    {
        return str_replace(['{roleName}'], [$this->roleName], '/api/roles/{roleName}');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody) {
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
     * @throws \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameConflictException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse200', 'json');
        }
        if (is_null($contentType) === false && (400 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameBadRequestException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse400', 'json'), $response);
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse404', 'json'), $response);
        }
        if (is_null($contentType) === false && (409 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameConflictException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse409', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}