<?php

namespace App\Http\Controllers\Kabaya\Web\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\LinkSystem;
use App\Models\User;
use App\Models\UserVerification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getVerificationStatus(
        $userStatus,
        $verificationStatus = null
    ) {

        /*
        |--------------------------------------------------------------------------
        | USER IS FULLY VERIFIED
        |--------------------------------------------------------------------------
        */

        if ($userStatus !== null && (int) $userStatus === 1) {

            return 'fully_verified';
        }


        /*
        |--------------------------------------------------------------------------
        | USER IS SEMI VERIFIED
        |--------------------------------------------------------------------------
        */

        if ($userStatus !== null && (int) $userStatus === 0) {

            return 'semi_verified';
        }


        /*
        |--------------------------------------------------------------------------
        | CHECK VERIFICATION STATUS
        |--------------------------------------------------------------------------
        */

        if ($verificationStatus === 'approved') {

            return 'fully_verified';
        }


        if ($verificationStatus === 'pending') {

            return 'semi_verified';
        }


        /*
        |--------------------------------------------------------------------------
        | DEFAULT
        |--------------------------------------------------------------------------
        */

        return 'not_verified';
    }

    public function dashboard()
    {
        /*
        |--------------------------------------------------------------------------
        | RESIDENT STATISTICS
        |--------------------------------------------------------------------------
        */

        $totalResidents = User::count();

        $notVerified = User::whereNull('is_verified')->count();

        $semiVerified = User::where('is_verified', 0)->count();

        $fullyVerified = User::where('is_verified', 1)->count();


        /*
        |--------------------------------------------------------------------------
        | LINKED SYSTEMS
        |--------------------------------------------------------------------------
        */

        $totalSystems = LinkSystem::count();

        $activeSystems = LinkSystem::where('is_active', true)->count();


        /*
        |--------------------------------------------------------------------------
        | VERIFICATION PERCENTAGE
        |--------------------------------------------------------------------------
        */

        $verificationPercentage = $totalResidents > 0
            ? round(($fullyVerified / $totalResidents) * 100, 1)
            : 0;


        /*
        |--------------------------------------------------------------------------
        | RECENT VERIFICATION REQUESTS
        |--------------------------------------------------------------------------
        |
        | id_type belongs to user_verifications,
        | NOT users.
        |
        */

        $recentRequests = UserVerification::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($verification) {

                $user = $verification->user;

                return [
                    'id' => $verification->id,

                    'name' => $user
                        ? collect([
                            $user->first_name,
                            $user->middle_name,
                            $user->last_name,
                            $user->suffix,
                        ])
                            ->filter()
                            ->join(' ')
                        : collect([
                            $verification->first_name,
                            $verification->middle_name,
                            $verification->last_name,
                        ])
                            ->filter()
                            ->join(' '),

                    'id_type' => $verification->id_type ?? 'Unknown ID',

                    'status' => $this->getVerificationStatus(
                        $user?->is_verified,
                        $verification->status
                    ),

                    'created_at' => $verification->created_at
                        ? $verification->created_at->toISOString()
                        : null,
                ];
            });


        /*
        |--------------------------------------------------------------------------
        | RECENT ACTIVITY
        |--------------------------------------------------------------------------
        */

        $recentActivity = UserVerification::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($verification) {

                $user = $verification->user;

                $name = $user
                    ? collect([
                        $user->first_name,
                        $user->last_name,
                    ])
                        ->filter()
                        ->join(' ')
                    : collect([
                        $verification->first_name,
                        $verification->last_name,
                    ])
                        ->filter()
                        ->join(' ');


                $status = $this->getVerificationStatus(
                    $user?->is_verified,
                    $verification->status
                );


                /*
                |--------------------------------------------------------------------------
                | ACTIVITY TITLE
                |--------------------------------------------------------------------------
                */

                $title = match ($status) {

                    'fully_verified' =>
                        'Resident fully verified',

                    'semi_verified' =>
                        'Resident semi verified',

                    default =>
                        'New verification request',
                };


                /*
                |--------------------------------------------------------------------------
                | ACTIVITY DESCRIPTION
                |--------------------------------------------------------------------------
                */

                $description = match ($status) {

                    'fully_verified' =>
                        "{$name} completed full verification.",

                    'semi_verified' =>
                        "{$name} completed semi verification.",

                    default =>
                        "{$name} submitted a verification request.",
                };


                return [

                    'id' => $verification->id,

                    'status' => $status,

                    'title' => $title,

                    'description' => $description,

                    'created_at' => (
                        $verification->updated_at
                        ?? $verification->created_at
                    )
                        ? (
                            $verification->updated_at
                        ?? $verification->created_at
                        )->toISOString()
                        : null,
                ];
            });


        /*
        |--------------------------------------------------------------------------
        | LINKED SYSTEMS
        |--------------------------------------------------------------------------
        */

        $systems = LinkSystem::latest()
            ->take(5)
            ->get()
            ->map(function ($system) {

                return [

                    'id' => $system->id,

                    'name' => $system->label,

                    'href' => $system->href,

                    'active' => (bool) $system->is_active,

                    'is_open' => (bool) $system->is_open,
                ];
            });


        /*
        |--------------------------------------------------------------------------
        | RETURN DASHBOARD DATA
        |--------------------------------------------------------------------------
        */

        return Inertia::render('app/super-admin/dashboard', [

            'dashboard' => [

                /*
                |--------------------------------------------------------------------------
                | STATISTICS
                |--------------------------------------------------------------------------
                */

                'statistics' => [

                    'total_residents' =>
                        $totalResidents,

                    'not_verified' =>
                        $notVerified,

                    'semi_verified' =>
                        $semiVerified,

                    'fully_verified' =>
                        $fullyVerified,

                    'total_systems' =>
                        $totalSystems,

                    'active_systems' =>
                        $activeSystems,
                ],


                /*
                |--------------------------------------------------------------------------
                | VERIFICATION
                |--------------------------------------------------------------------------
                */

                'verification' => [

                    'percentage' =>
                        $verificationPercentage,

                    'total' =>
                        $totalResidents,

                    'not_verified' =>
                        $notVerified,

                    'semi_verified' =>
                        $semiVerified,

                    'fully_verified' =>
                        $fullyVerified,
                ],


                /*
                |--------------------------------------------------------------------------
                | RECENT REQUESTS
                |--------------------------------------------------------------------------
                */

                'recent_requests' =>
                    $recentRequests,


                /*
                |--------------------------------------------------------------------------
                | RECENT ACTIVITY
                |--------------------------------------------------------------------------
                */

                'recent_activity' =>
                    $recentActivity,


                /*
                |--------------------------------------------------------------------------
                | LINKED SYSTEMS
                |--------------------------------------------------------------------------
                */

                'systems' =>
                    $systems,
            ],
        ]);
    }
}
