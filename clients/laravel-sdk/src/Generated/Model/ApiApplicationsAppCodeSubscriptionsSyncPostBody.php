<?php

namespace FlowCatalyst\Generated\Model;

class ApiApplicationsAppCodeSubscriptionsSyncPostBody extends \ArrayObject
{
    /**
     * @var array
     */
    protected $initialized = [];
    public function isInitialized($property): bool
    {
        return array_key_exists($property, $this->initialized);
    }
    /**
     * @var list<ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem>|null
     */
    protected $subscriptions;
    /**
     * @return list<ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem>|null
     */
    public function getSubscriptions(): ?array
    {
        return $this->subscriptions;
    }
    /**
     * @param list<ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem>|null $subscriptions
     *
     * @return self
     */
    public function setSubscriptions(?array $subscriptions): self
    {
        $this->initialized['subscriptions'] = true;
        $this->subscriptions = $subscriptions;
        return $this;
    }
}