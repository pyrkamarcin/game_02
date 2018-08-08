<?php

namespace App\SRD;


class Race
{
    private $race;

    public function __construct(string $race)
    {
        $this->race = $race;
    }

    public function __toString()
    {
        return $this->race;
    }
}