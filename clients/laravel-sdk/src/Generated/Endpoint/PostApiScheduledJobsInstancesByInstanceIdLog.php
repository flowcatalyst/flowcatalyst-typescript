<?php

namespace FlowCatalyst\Generated\Endpoint;

class PostApiScheduledJobsInstancesByInstanceIdLog extends \FlowCatalyst\Generated\Runtime\Client\BaseEndpoint implements \FlowCatalyst\Generated\Runtime\Client\Endpoint
{
    protected $instanceId;
    /**
     * @param string $instanceId
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody $requestBody
     */
    public function __construct(string $instanceId, ?\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody $requestBody = null)
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
        return str_replace(['{instanceId}'], [$this->instanceId], '/api/scheduled-jobs/instances/{instanceId}/log');
    }
    public function getBody(\Symfony\Component\Serializer\SerializerInterface $serializer, $streamFactory = null): array
    {
        if ($this->body instanceof \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody) {
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
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsInstancesByInstanceIdLogNotFoundException
     *
     * @return null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse201
     */
    protected function transformResponseBody(\Psr\Http\Message\ResponseInterface $response, \Symfony\Component\Serializer\SerializerInterface $serializer, ?string $contentType = null)
    {
        $status = $response->getStatusCode();
        $body = (string) $response->getBody();
        if (is_null($contentType) === false && (201 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            return $serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse201', 'json');
        }
        if (is_null($contentType) === false && (404 === $status && mb_strpos(strtolower($contentType), 'application/json') !== false)) {
            throw new \FlowCatalyst\Generated\Exception\PostApiScheduledJobsInstancesByInstanceIdLogNotFoundException($serializer->deserialize($body, 'FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse404', 'json'), $response);
        }
    }
    public function getAuthenticationScopes(): array
    {
        return ['bearerAuth'];
    }
}