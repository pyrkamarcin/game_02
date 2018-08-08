<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class AdminController
 * @package App\Controller
 */
class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin_index")
     * @return Response
     */
    public function indexAction()
    {
        return new Response('<html><body>Admin page!</body></html>');
    }
}
