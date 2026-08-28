<?php

namespace App\Http\Controllers\Kabaya\Web\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Mail\PasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Mail;

class UserController extends Controller
{
    public function admin()
    {
        return Inertia::render('app/super-admin/users/admin');
    }

    /**
     * Get admin accounts.
     */
    public function getAdmin(Request $request)
    {
        $admins = User::query()
            ->select([
                'id',
                'id_number',
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'user_name',
                'email',
                'mobile_number',
                'is_verified',
                'is_resident',
                'role',
                'created_at',
            ])
            ->where('role', 'admin')
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->search;

                    $query->where(function ($query) use ($search) {
                        $query
                            ->where(
                                'first_name',
                                'LIKE',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'middle_name',
                                'LIKE',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'last_name',
                                'LIKE',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'user_name',
                                'LIKE',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'email',
                                'LIKE',
                                "%{$search}%"
                            );
                    });
                }
            )
            ->latest()
            ->paginate(
                min(
                    $request->integer('per_page', 20),
                    100
                )
            );

        return response()->json($admins);
    }

    /**
     * Create admin account.
     */
    public function addAdmin(Request $request)
    {
        $validated = $request->validate([
            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'last_name' => [
                'required',
                'string',
                'max:255',
            ],

            'suffix' => [
                'nullable',
                'string',
                'max:50',
            ],

            'user_name' => [
                'required',
                'string',
                'max:255',
                'unique:users,user_name',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Generate secure temporary password
        |--------------------------------------------------------------------------
        */

        $password = Str::password(
            length: 16,
            letters: true,
            numbers: true,
            symbols: true,
        );

        /*
        |--------------------------------------------------------------------------
        | Create Admin
        |--------------------------------------------------------------------------
        */

        $admin = User::create([
            'first_name' => $validated['first_name'],

            'middle_name' =>
                $validated['middle_name'] ?? null,

            'last_name' => $validated['last_name'],

            'suffix' =>
                $validated['suffix'] ?? null,

            'user_name' => $validated['user_name'],

            'email' => $validated['email'],

            /*
             * Automatically admin.
             */
            'role' => 'admin',

            /*
             * Automatically verified.
             */
            'is_verified' => true,

            /*
             * Admin is not a resident.
             */
            'is_resident' => false,

            /*
             * Your User model already has:
             *
             * 'password' => 'hashed'
             *
             * so Laravel will hash this automatically.
             */
            'password' => $password,
        ]);

        Mail::to($admin->email)->send(new PasswordMail($admin->first_name, $admin->user_name, $password));

        return response()->json([
            'success' => true,

            'message' =>
                'Admin account created successfully.',

            'data' => [
                'id' => $admin->id,
                'first_name' => $admin->first_name,
                'middle_name' => $admin->middle_name,
                'last_name' => $admin->last_name,
                'suffix' => $admin->suffix,
                'user_name' => $admin->user_name,
                'email' => $admin->email,
                'role' => $admin->role,
                'is_verified' => $admin->is_verified,
                'is_resident' => $admin->is_resident,
            ],

            /*
             * This is returned only once.
             */
            'temporary_password' => $password,
        ], 201);
    }
}