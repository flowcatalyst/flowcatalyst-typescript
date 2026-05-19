<?php

namespace FlowCatalyst\Generated\Model;

class ApiScheduledJobsInstancesInstanceIdLogPostBody extends \ArrayObject
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
     * @var mixed|null
     */
    protected $level;
    /**
     * @var string|null
     */
    protected $message;
    /**
     * @var mixed|null
     */
    protected $metadata;
    /**
     * @return mixed
     */
    public function getLevel()
    {
        return $this->level;
    }
    /**
     * @param mixed $level
     *
     * @return self
     */
    public function setLevel($level): self
    {
        $this->initialized['level'] = true;
        $this->level = $level;
        return $this;
    }
    /**
     * @return string|null
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }
    /**
     * @param string|null $message
     *
     * @return self
     */
    public function setMessage(?string $message): self
    {
        $this->initialized['message'] = true;
        $this->message = $message;
        return $this;
    }
    /**
     * @return mixed
     */
    public function getMetadata()
    {
        return $this->metadata;
    }
    /**
     * @param mixed $metadata
     *
     * @return self
     */
    public function setMetadata($metadata): self
    {
        $this->initialized['metadata'] = true;
        $this->metadata = $metadata;
        return $this;
    }
}