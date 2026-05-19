<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiApplicationsByAppCodeSubscriptionsSync extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $appCode;
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     */
    public function __construct(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody $requestBody = null, array $queryParameters = [])
    {
        $this->appCode = $appCode;
        $this->body = $requestBody;
        $this->queryParameters = $queryParameters;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'POST';
    }
    public function getUri(): string
    {
        return str_replace(['{appCode}'], [$this->appCode], '/api/applications/{appCode}/subscriptions/sync');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody) {
            return [['Content-Type' => ['application/json']], $serializer->serialize($this->body, 'json')];
        }
        return [[], null];
    }
    public function getExtraHeaders(): array
    {
        return ['Accept' => ['application/json']];
    }
    protected function getQueryOptionsResolver(): \Symfony\Component\OptionsResolver\OptionsResolver
    {
        $optionsResolver = parent::getQueryOptionsResolver();
        $optionsResolver->setDefined(['removeUnlisted']);
        $optionsResolver->setRequired([]);
        $optionsResolver->setDefaults([]);
        $optionsResolver->addAllowedTypes('removeUnlisted', ['bool']);
        return $optionsResolver;
    }
    /**
     * {@inheritdoc}
     *
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeSubscriptionsSyncBadRequestException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse200', 'json');
        }
        if (is_null($contentType) === false && (400 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeSubscriptionsSyncBadRequestException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}