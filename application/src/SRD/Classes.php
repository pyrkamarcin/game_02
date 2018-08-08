<?php

namespace App\SRD;

class Classes
{
    /**
     * @var array
     */
    private $classes;

    /**
     * Classes constructor.
     * @param array $classes
     */
    public function __construct(array $classes)
    {
        $this->classes = $classes;
    }

    /**
     * @return array
     */
    public function getClasses(): array
    {
        return $this->classes;
    }

    /**
     * @param array $classes
     */
    public function setClasses(array $classes): void
    {
        $this->classes = $classes;
    }
}