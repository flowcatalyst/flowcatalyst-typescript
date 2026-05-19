<?php

namespace FlowCatalyst\Generated\Endpoint;

class GetApiEmailDomainMappingsLookupByDomain extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $domain;
    /**
     * @param string $domain
     */
    public function __construct(string $domain)
    {
        $this->domain = $domain;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'GET';
    }
    public function getUri(): string
    {
        return str_replace(['{domain}'], [$this->domain], '/api/email-domain-mappings/lookup/{domain}');
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
     * @throws \FlowCatalyst\Generated\Exception\GetApiEmailDomainMappingsLookupByDomainNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse200', 'json');
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\GetApiEmailDomainMappingsLookupByDomainNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}