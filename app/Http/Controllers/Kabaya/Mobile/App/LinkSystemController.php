<?php

namespace App\Http\Controllers\Kabaya\Mobile\App;

use App\Http\Controllers\Controller;
use App\Models\LinkSystem;
use Illuminate\Http\Request;

class LinkSystemController extends Controller
{
    public function getLinkSystem()
    {
        $systems = LinkSystem::select(
            'label',
            'icon',
            'href',
            'is_active',
        )
            ->get();

        return response()->json($systems);
    }
}
