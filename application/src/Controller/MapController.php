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
        return $this->render('map/index.html.twig', [
        ]);
    }
}
