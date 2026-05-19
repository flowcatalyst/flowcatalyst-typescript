<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiScheduledJobsInstancesByInstanceIdComplete extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $instanceId;
    /**
     * @param string $instanceId
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody $requestBody
     */
    public function __construct(string $instanceId, ?\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody $requestBody = null)
    {
        $this->instanceId = $instanceId;
        $this->body = $requestBody;
    }
    use \FlowCatalyst\Generated\Runtime\Client\EndpointTrait;
    public function getMethod(): string
    {
        return 'POST';
    }
    public function getUri(): string
    {
        return str_replace(['{instanceId}'], [$this->instanceId], '/api/scheduled-jobs/instances/{instanceId}/complete');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody) {
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
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsInstancesByInstanceIdCompleteNotFoundException
     *
     * @return null
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (204 === $status) {
            return null;
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiScheduledJobsInstancesByInstanceIdCompleteNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}