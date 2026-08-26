<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WebController extends Controller
{
    public function home()
    {
        return Inertia::render('home');
    }

    public function privacyPolicy()
    {
        return Inertia::render('privacy-policy');
    }
}
