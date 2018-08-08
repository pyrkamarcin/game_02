<?php

namespace App\Controller;

use App\Entity\Ability;
use App\Entity\Character;
use App\Form\AbilityType;
use App\Repository\AbilityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AbilityController extends AbstractController
{
    /**
     * @Route("/character/{character}/ability", name="ability_index", methods="GET")
     */
    public function index(Character $character, AbilityRepository $abilityRepository): Response
    {
        return $this->render('ability/index.html.twig', [
            'abilities' => $abilityRepository->findByCharacterField($character),
            'character' => $character
        ]);
    }

    /**
     * @Route("/character/{character}/ability/new", name="ability_new", methods="GET|POST")
     */
    public function new(Character $character, Request $request): Response
    {
        $ability = new Ability();
        $form = $this->createForm(AbilityType::class, $ability);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $ability->setCharacter($character);
            $em->persist($ability);
            $em->flush();

            return $this->redirectToRoute('ability_index');
        }

        return $this->render('ability/new.html.twig', [
            'ability' => $ability,
            'form' => $form->createView(),
            'character' => $character
        ]);
    }

    /**
     * @Route("/character/{character}/ability/{ability}", name="ability_show", methods="GET")
     */
    public function show(Character $character, Ability $ability): Response
    {
        return $this->render('ability/show.html.twig', [
            'ability' => $ability,
            'character' => $character
        ]);
    }

    /**
     * @Route("/character/{character}/ability/{ability}/edit", name="ability_edit", methods="GET|POST")
     */
    public function edit(Request $request, Character $character, Ability $ability): Response
    {
        $form = $this->createForm(AbilityType::class, $ability);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('ability_edit', ['character' => $character->getId(), 'ability' => $ability->getId()]);
        }

        return $this->render('ability/edit.html.twig', [
            'ability' => $ability,
            'form' => $form->createView(),
            'character' => $character
        ]);
    }

    /**
     * @Route("/character/{$character}/ability/{$ability}", name="ability_delete", methods="DELETE")
     */
    public function delete(Request $request, Character $character, Ability $ability): Response
    {
        if ($this->isCsrfTokenValid('delete' . $ability->getId(), $request->request->get('_token'))) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($ability);
            $em->flush();
        }

        return $this->redirectToRoute('ability_index');
    }
}
