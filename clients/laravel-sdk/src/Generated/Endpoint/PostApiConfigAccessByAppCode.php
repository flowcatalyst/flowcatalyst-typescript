<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiConfigAccessByAppCode extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $appCode;
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody $requestBody
     */
    public function __construct(string $appCode, ?\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody $requestBody = null)
    {
        $this->appCode = $appCode;
        $this->body = $requestBody;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'POST';
    }
    public function getUri(): string
    {
        return str_replace(['{appCode}'], [$this->appCode], '/api/config-access/{appCode}');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody) {
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
     * @throws \FlowCatalyst\Generated\Exception\PostApiConfigAccessByAppCodeConflictException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse201
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (201 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse201', 'json');
        }
        if (is_null($contentType) === false && (409 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiConfigAccessByAppCodeConflictException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse409', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}