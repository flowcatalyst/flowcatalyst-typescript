<?php

namespace FlowCatalyst\Generated\Endpoint;

class GetApiConfigByAppCodeBySectionByProperty extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $appCode;
    protected $section;
    protected $property;
    /**
     * @param string $appCode
     * @param string $section
     * @param string $property
     * @param array{
     *    "scope"?: string,
     *    "clientId"?: string,
     * } $queryParameters
     */
    public function __construct(string $appCode, string $section, string $property, array $queryParameters = [])
    {
        $this->appCode = $appCode;
        $this->section = $section;
        $this->property = $property;
        $this->queryParameters = $queryParameters;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'GET';
    }
    public function getUri(): string
    {
        return str_replace(['{appCode}', '{section}', '{property}'], [$this->appCode, $this->section, $this->property], '/api/config/{appCode}/{section}/{property}');
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
        $optionsResolver->setDefined(['scope', 'clientId']);
        $optionsResolver->setRequired([]);
        $optionsResolver->setDefaults([]);
        $optionsResolver->addAllowedTypes('scope', ['string']);
        $optionsResolver->addAllowedTypes('clientId', ['string']);
        return $optionsResolver;
    }
    /**
     * {@inheritdoc}
     *
     * @throws \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionByPropertyForbiddenException
     * @throws \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionByPropertyNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse200
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (200 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse200', 'json');
        }
        if (is_null($contentType) === false && (403 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionByPropertyForbiddenException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse403', 'json'), $response);
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionByPropertyNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}