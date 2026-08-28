<?php

namespace App\Http\Controllers\Kabaya\Web\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('app/super-admin/dashboard');
    }
}
