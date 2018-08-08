<?php

namespace App\Controller;

use App\Entity\Town;
use App\Form\TownType;
use App\Repository\TownRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/town")
 */
class TownController extends Controller
{
    /**
     * @Route("/", name="town_index", methods="GET")
     */
    public function index(TownRepository $townRepository): Response
    {
        return $this->render('town/index.html.twig', ['towns' => $townRepository->findAll()]);
    }

    /**
     * @Route("/new", name="town_new", methods="GET|POST")
     */
    public function new(Request $request): Response
    {
        $town = new Town();
        $form = $this->createForm(TownType::class, $town);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $town->setPlayer($this->getUser());
            $em->persist($town);
            $em->flush();

            return $this->redirectToRoute('town_index');
        }

        return $this->render('town/new.html.twig', [
            'town' => $town,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="town_show", methods="GET")
     */
    public function show(Town $town): Response
    {
        return $this->render('town/show.html.twig', ['town' => $town]);
    }

    /**
     * @Route("/{id}/edit", name="town_edit", methods="GET|POST")
     */
    public function edit(Request $request, Town $town): Response
    {
        $form = $this->createForm(TownType::class, $town);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('town_edit', ['id' => $town->getId()]);
        }

        return $this->render('town/edit.html.twig', [
            'town' => $town,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="town_delete", methods="DELETE")
     */
    public function delete(Request $request, Town $town): Response
    {
        if ($this->isCsrfTokenValid('delete'.$town->getId(), $request->request->get('_token'))) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($town);
            $em->flush();
        }

        return $this->redirectToRoute('town_index');
    }
}
