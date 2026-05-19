<?php

namespace FlowCatalyst\Generated\Normalizer;

use Jane\Component\JsonSchemaRuntime\Reference;
use FlowCatalyst\Generated\Runtime\Normalizer\CheckArray;
use FlowCatalyst\Generated\Runtime\Normalizer\ValidatorTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
class ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItemNormalizer implements DenormalizerInterface, NormalizerInterface, DenormalizerAwareInterface, NormalizerAwareInterface
{
    use DenormalizerAwareTrait;
    use NormalizerAwareTrait;
    use CheckArray;
    use ValidatorTrait;
    public function supportsDenormalization(mixed $data, string $type, ?string $format = null, array $context = []): bool
    {
        return $type === \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem::class;
    }
    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return is_object($data) && get_class($data) === \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem::class;
    }
    public function denormalize(mixed $data, string $type, ?string $format = null, array $context = []): mixed
    {
        if (isset($data['$ref'])) {
            return new Reference($data['$ref'], $context['document-origin']);
        }
        if (isset($data['$recursiveRef'])) {
            return new Reference($data['$recursiveRef'], $context['document-origin']);
        }
        $object = new \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem();
        if (\array_key_exists('clientScoped', $data) && \is_int($data['clientScoped'])) {
            $data['clientScoped'] = (bool) $data['clientScoped'];
        }
        if (\array_key_exists('active', $data) && \is_int($data['active'])) {
            $data['active'] = (bool) $data['active'];
        }
        if (null === $data || false === \is_array($data)) {
            return $object;
        }
        if (\array_key_exists('code', $data) && $data['code'] !== null) {
            $object->setCode($data['code']);
            unset($data['code']);
        }
        elseif (\array_key_exists('code', $data) && $data['code'] === null) {
            $object->setCode(null);
        }
        if (\array_key_exists('name', $data) && $data['name'] !== null) {
            $object->setName($data['name']);
            unset($data['name']);
        }
        elseif (\array_key_exists('name', $data) && $data['name'] === null) {
            $object->setName(null);
        }
        if (\array_key_exists('target', $data) && $data['target'] !== null) {
            $object->setTarget($data['target']);
            unset($data['target']);
        }
        elseif (\array_key_exists('target', $data) && $data['target'] === null) {
            $object->setTarget(null);
        }
        if (\array_key_exists('endpoint', $data) && $data['endpoint'] !== null) {
            $object->setEndpoint($data['endpoint']);
            unset($data['endpoint']);
        }
        elseif (\array_key_exists('endpoint', $data) && $data['endpoint'] === null) {
            $object->setEndpoint(null);
        }
        if (\array_key_exists('connectionId', $data) && $data['connectionId'] !== null) {
            $object->setConnectionId($data['connectionId']);
            unset($data['connectionId']);
        }
        elseif (\array_key_exists('connectionId', $data) && $data['connectionId'] === null) {
            $object->setConnectionId(null);
        }
        if (\array_key_exists('queue', $data) && $data['queue'] !== null) {
            $object->setQueue($data['queue']);
            unset($data['queue']);
        }
        elseif (\array_key_exists('queue', $data) && $data['queue'] === null) {
            $object->setQueue(null);
        }
        if (\array_key_exists('dispatchPoolCode', $data) && $data['dispatchPoolCode'] !== null) {
            $object->setDispatchPoolCode($data['dispatchPoolCode']);
            unset($data['dispatchPoolCode']);
        }
        elseif (\array_key_exists('dispatchPoolCode', $data) && $data['dispatchPoolCode'] === null) {
            $object->setDispatchPoolCode(null);
        }
        if (\array_key_exists('clientScoped', $data) && $data['clientScoped'] !== null) {
            $object->setClientScoped($data['clientScoped']);
            unset($data['clientScoped']);
        }
        elseif (\array_key_exists('clientScoped', $data) && $data['clientScoped'] === null) {
            $object->setClientScoped(null);
        }
        if (\array_key_exists('maxRetries', $data) && $data['maxRetries'] !== null) {
            $object->setMaxRetries($data['maxRetries']);
            unset($data['maxRetries']);
        }
        elseif (\array_key_exists('maxRetries', $data) && $data['maxRetries'] === null) {
            $object->setMaxRetries(null);
        }
        if (\array_key_exists('retryDelaySeconds', $data) && $data['retryDelaySeconds'] !== null) {
            $object->setRetryDelaySeconds($data['retryDelaySeconds']);
            unset($data['retryDelaySeconds']);
        }
        elseif (\array_key_exists('retryDelaySeconds', $data) && $data['retryDelaySeconds'] === null) {
            $object->setRetryDelaySeconds(null);
        }
        if (\array_key_exists('timeoutSeconds', $data) && $data['timeoutSeconds'] !== null) {
            $object->setTimeoutSeconds($data['timeoutSeconds']);
            unset($data['timeoutSeconds']);
        }
        elseif (\array_key_exists('timeoutSeconds', $data) && $data['timeoutSeconds'] === null) {
            $object->setTimeoutSeconds(null);
        }
        if (\array_key_exists('active', $data) && $data['active'] !== null) {
            $object->setActive($data['active']);
            unset($data['active']);
        }
        elseif (\array_key_exists('active', $data) && $data['active'] === null) {
            $object->setActive(null);
        }
        if (\array_key_exists('applicationCode', $data) && $data['applicationCode'] !== null) {
            $object->setApplicationCode($data['applicationCode']);
            unset($data['applicationCode']);
        }
        elseif (\array_key_exists('applicationCode', $data) && $data['applicationCode'] === null) {
            $object->setApplicationCode(null);
        }
        if (\array_key_exists('description', $data) && $data['description'] !== null) {
            $object->setDescription($data['description']);
            unset($data['description']);
        }
        elseif (\array_key_exists('description', $data) && $data['description'] === null) {
            $object->setDescription(null);
        }
        if (\array_key_exists('eventTypeCode', $data) && $data['eventTypeCode'] !== null) {
            $object->setEventTypeCode($data['eventTypeCode']);
            unset($data['eventTypeCode']);
        }
        elseif (\array_key_exists('eventTypeCode', $data) && $data['eventTypeCode'] === null) {
            $object->setEventTypeCode(null);
        }
        foreach ($data as $key => $value) {
            if (preg_match('/.*/', (string) $key)) {
                $object[$key] = $value;
            }
        }
        return $object;
    }
    public function normalize(mixed $data, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $dataArray = [];
        $dataArray['code'] = $data->getCode();
        $dataArray['name'] = $data->getName();
        if ($data->isInitialized('target') && null !== $data->getTarget()) {
            $dataArray['target'] = $data->getTarget();
        }
        if ($data->isInitialized('endpoint') && null !== $data->getEndpoint()) {
            $dataArray['endpoint'] = $data->getEndpoint();
        }
        if ($data->isInitialized('connectionId') && null !== $data->getConnectionId()) {
            $dataArray['connectionId'] = $data->getConnectionId();
        }
        $dataArray['queue'] = $data->getQueue();
        $dataArray['dispatchPoolCode'] = $data->getDispatchPoolCode();
        if ($data->isInitialized('clientScoped') && null !== $data->getClientScoped()) {
            $dataArray['clientScoped'] = $data->getClientScoped();
        }
        if ($data->isInitialized('maxRetries') && null !== $data->getMaxRetries()) {
            $dataArray['maxRetries'] = $data->getMaxRetries();
        }
        if ($data->isInitialized('retryDelaySeconds') && null !== $data->getRetryDelaySeconds()) {
            $dataArray['retryDelaySeconds'] = $data->getRetryDelaySeconds();
        }
        if ($data->isInitialized('timeoutSeconds') && null !== $data->getTimeoutSeconds()) {
            $dataArray['timeoutSeconds'] = $data->getTimeoutSeconds();
        }
        if ($data->isInitialized('active') && null !== $data->getActive()) {
            $dataArray['active'] = $data->getActive();
        }
        if ($data->isInitialized('applicationCode') && null !== $data->getApplicationCode()) {
            $dataArray['applicationCode'] = $data->getApplicationCode();
        }
        if ($data->isInitialized('description') && null !== $data->getDescription()) {
            $dataArray['description'] = $data->getDescription();
        }
        if ($data->isInitialized('eventTypeCode') && null !== $data->getEventTypeCode()) {
            $dataArray['eventTypeCode'] = $data->getEventTypeCode();
        }
        foreach ($data as $key => $value) {
            if (preg_match('/.*/', (string) $key)) {
                $dataArray[$key] = $value;
            }
        }
        return $dataArray;
    }
    public function getSupportedTypes(?string $format = null): array
    {
        return [\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem::class => false];
    }
}