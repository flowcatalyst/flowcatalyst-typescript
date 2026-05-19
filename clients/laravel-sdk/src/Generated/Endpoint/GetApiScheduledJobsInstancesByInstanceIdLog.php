<?php

namespace FlowCatalyst\Generated\Endpoint;

class GetApiScheduledJobsInstancesByInstanceIdLog extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $instanceId;
    /**
     * @param string $instanceId
     * @param array{
     *    "limit"?: int,
     * } $queryParameters
     */
    public function __construct(string $instanceId, array $queryParameters = [])
    {
        $this->instanceId = $instanceId;
        $this->queryParameters = $queryParameters;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'GET';
    }
    public function getUri(): string
    {
        return str_replace(['{instanceId}'], [$this->instanceId], '/api/scheduled-jobs/instances/{instanceId}/logs');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        return [[], null];
    }
    public function getExtraHeaders(): array
    {
        return ['Accept' => ['application/json']];
    }
    protected function getQueryOptionsResolver(): \Symfony\Component\OptionsResolver\OptionsResolver
    {
        $optionsResolver = parent::getQueryOptionsResolver();
        $optionsResolver->setDefined(['limit']);
        $optionsResolver->setRequired([]);
        $optionsResolver->setDefaults([]);
        $optionsResolver->addAllowedTypes('limit', ['int']);
        return $optionsResolver;
    }
    /**
     * {@inheritdoc}
     *
     * @throws \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstancesByInstanceIdLogNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200', 'json');
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstancesByInstanceIdLogNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}