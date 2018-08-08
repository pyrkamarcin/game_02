<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class AccountController
 * @package App\Controller
 * @Route("/account")
 */
class AccountController extends AbstractController
{
    /**
     * @Route("/", name="account_index")
     */
    public function index()
    {
        return $this->render('account/index.html.twig', []);
    }

    /**
     * @Route("/settings", name="account_settings")
     */
    public function settings()
    {
        return $this->render('account/settings.html.twig', []);
    }

    /**
     * @Route("/management", name="account_management")
     */
    public function management()
    {
        return $this->render('account/management.html.twig', []);
    }
}
