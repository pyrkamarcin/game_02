<?php

namespace App\Controller;

use App\Entity\Race;
use App\Form\RaceType;
use App\Repository\RaceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/race")
 */
class RaceController extends Controller
{
    /**
     * @Route("/", name="race_index", methods="GET")
     */
    public function index(RaceRepository $raceRepository): Response
    {
        return $this->render('race/index.html.twig', ['races' => $raceRepository->findAll()]);
    }

    /**
     * @Route("/new", name="race_new", methods="GET|POST")
     */
    public function new(Request $request): Response
    {
        $race = new Race();
        $form = $this->createForm(RaceType::class, $race);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($race);
            $em->flush();

            return $this->redirectToRoute('race_index');
        }

        return $this->render('race/new.html.twig', [
            'race' => $race,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="race_show", methods="GET")
     */
    public function show(Race $race): Response
    {
        return $this->render('race/show.html.twig', ['race' => $race]);
    }

    /**
     * @Route("/{id}/edit", name="race_edit", methods="GET|POST")
     */
    public function edit(Request $request, Race $race): Response
    {
        $form = $this->createForm(RaceType::class, $race);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('race_edit', ['id' => $race->getId()]);
        }

        return $this->render('race/edit.html.twig', [
            'race' => $race,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="race_delete", methods="DELETE")
     */
    public function delete(Request $request, Race $race): Response
    {
        if ($this->isCsrfTokenValid('delete'.$race->getId(), $request->request->get('_token'))) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($race);
            $em->flush();
        }

        return $this->redirectToRoute('race_index');
    }
}
