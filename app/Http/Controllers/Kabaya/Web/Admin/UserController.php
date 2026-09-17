<?php

namespace App\Http\Controllers\Kabaya\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function resident()
    {
        return Inertia::render('app/admin/users/resident');
    }

    public function getResident(Request $request)
    {
        $search = $request->input('search');

        $residents = User::select(
            'id',
            'id_number',
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'is_verified',
            'is_resident'
        )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id_number', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%");
                });
            })
            ->where('role', 'user')
            ->whereNotNull('is_verified')
            ->paginate(50);

        return response()->json($residents);
    }
}
