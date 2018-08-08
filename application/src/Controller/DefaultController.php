<?php

namespace App\Controller;

use App\Domain\Map;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class DefaultController
 * @package App\Controller
 */
class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="homepage")
     * @return Response
     */
    public function indexAction(): Response
    {
        if ($this->getUser()) {
            return $this->render('default/index.html.twig', []);
        }
        return $this->render('default/index.html.twig', []);
    }
}
