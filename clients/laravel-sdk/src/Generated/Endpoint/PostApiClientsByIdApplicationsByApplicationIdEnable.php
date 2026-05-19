<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiClientsByIdApplicationsByApplicationIdEnable extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $id;
    protected $applicationId;
    /**
     * @param string $id
     * @param string $applicationId
     */
    public function __construct(string $id, string $applicationId)
    {
        $this->id = $id;
        $this->applicationId = $applicationId;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'POST';
    }
    public function getUri(): string
    {
        return str_replace(['{id}', '{applicationId}'], [$this->id, $this->applicationId], '/api/clients/{id}/applications/{applicationId}/enable');
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
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdApplicationsByApplicationIdEnableNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse200', 'json');
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiClientsByIdApplicationsByApplicationIdEnableNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}