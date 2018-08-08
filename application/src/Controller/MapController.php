<?php

namespace App\Controller;

use App\Domain\Map;
use App\Entity\Town;
use App\Repository\TownRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MapController extends Controller
{
    /**
     * @Route("/map", name="map")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index()
    {

        $town = new Town();
        $town->setName('test');
        $town->setPosX(2);
        $town->setPosY(5);

        $map = new Map();
        $map->placeTowns([$town]);

        dump($town);
        dump($map);

        return $this->render('map/index.html.twig', [
            'map' => $map->getMap(),
            'test' => 'test'
        ]);
    }
}
