<?php

namespace App\Domain;

use App\Repository\TownRepository;

class Map
{
    const SIZE = 12;
    private $map = [];

    public function __construct()
    {
        for ($x = 1; $x <= self::SIZE; $x++) {
            for ($y = 1; $y <= self::SIZE; $y++) {
                $this->map[$x][$y] = null;
            }
        }
    }

    public function placeTowns($towns)
    {
        foreach ($towns as $town) {
            $this->map[$town->getPosX()][$town->getPosY()]['town'] = $town;
        }
    }

    /**
     * @return array
     */
    public function getMap(): array
    {
        return $this->map;
    }

}