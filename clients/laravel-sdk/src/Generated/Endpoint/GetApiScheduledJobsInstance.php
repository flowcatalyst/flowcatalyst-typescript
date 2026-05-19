<?php

namespace FlowCatalyst\Generated\Endpoint;

class GetApiScheduledJobsInstance extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    /**
     * @param array{
     *    "scheduledJobId"?: string,
     *    "clientId"?: string,
     *    "status"?: string,
     *    "triggerKind"?: string,
     *    "from"?: string,
     *    "to"?: string,
     *    "limit"?: int,
     *    "offset"?: int,
     * } $queryParameters
     */
    public function __construct(array $queryParameters = [])
    {
        $this->queryParameters = $queryParameters;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'GET';
    }
    public function getUri(): string
    {
        return '/api/scheduled-jobs/instances';
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
        $optionsResolver->setDefined(['scheduledJobId', 'clientId', 'status', 'triggerKind', 'from', 'to', 'limit', 'offset']);
        $optionsResolver->setRequired([]);
        $optionsResolver->setDefaults([]);
        $optionsResolver->addAllowedTypes('scheduledJobId', ['string']);
        $optionsResolver->addAllowedTypes('clientId', ['string']);
        $optionsResolver->addAllowedTypes('status', ['string']);
        $optionsResolver->addAllowedTypes('triggerKind', ['string']);
        $optionsResolver->addAllowedTypes('from', ['string']);
        $optionsResolver->addAllowedTypes('to', ['string']);
        $optionsResolver->addAllowedTypes('limit', ['int']);
        $optionsResolver->addAllowedTypes('offset', ['int']);
        return $optionsResolver;
    }
    /**
     * {@inheritdoc}
     *
     * @throws \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstanceNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200', 'json');
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstanceNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}