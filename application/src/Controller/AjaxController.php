<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AjaxController extends Controller
{
    /**
     * @Route("/ajax/test", name="ajax")
     */
    public function test(Request $request)
    {
        $x = $request->get('x');
        $y = $request->get('y');

        if ($x == 2 && $y == 4) {
            $response = ['town' => ['name' => 'City 1', 'population' => 24114]];
        } else {
            $response = null;
        }
        return $this->json(['response' => $response]);
    }
}
