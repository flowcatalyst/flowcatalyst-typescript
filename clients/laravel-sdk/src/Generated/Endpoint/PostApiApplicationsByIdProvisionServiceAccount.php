<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiApplicationsByIdProvisionServiceAccount extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $id;
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody $requestBody
     */
    public function __construct(string $id, ?\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody $requestBody = null)
    {
        $this->id = $id;
        $this->body = $requestBody;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'POST';
    }
    public function getUri(): string
    {
        return str_replace(['{id}'], [$this->id], '/api/applications/{id}/provision-service-account');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody) {
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
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountConflictException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse201
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (201 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse201', 'json');
        }
        if (is_null($contentType) === false && (400 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountBadRequestException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse400', 'json'), $response);
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse404', 'json'), $response);
        }
        if (is_null($contentType) === false && (409 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountConflictException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse409', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}