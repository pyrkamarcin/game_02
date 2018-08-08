<?php

namespace App\Controller;

use App\Repository\CharacterRepository;
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
     * @param CharacterRepository $characterRepository
     * @return Response
     */
    public function indexAction(CharacterRepository $characterRepository): Response
    {
        if ($this->getUser()) {
            $playerCharacters = $characterRepository->findByPlayerField($this->getUser());

            return $this->render('default/index.html.twig', ['playerCharacters' => $playerCharacters]);
        }
        return $this->render('default/index.html.twig', []);
    }
}
