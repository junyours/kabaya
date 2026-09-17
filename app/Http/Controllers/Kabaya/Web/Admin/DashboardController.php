<?php

namespace App\Http\Controllers\Kabaya\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\LinkSystem;
use App\Models\User;
use App\Models\UserVerification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getVerificationStatus($userStatus, $verificationStatus = null)
    {
        if ($userStatus !== null) {
            return match ((int) $userStatus) {
                1 => 'fully_verified',
                0 => 'semi_verified',
                default => 'not_verified',
            };
        }

        return match ($verificationStatus) {
            'approved' => 'fully_verified',
            'pending' => 'semi_verified',
            default => 'not_verified',
        };
    }

    private function getFullName($user, $verification = null)
    {
        return collect([
            $user?->first_name ?? $verification?->first_name,
            $user?->middle_name ?? $verification?->middle_name,
            $user?->last_name ?? $verification?->last_name,
            $user?->suffix,
        ])
            ->filter()
            ->join(' ');
    }

    public function dashboard()
    {
        $totalResidents = User::count();
        $notVerified = User::whereNull('is_verified')->count();
        $semiVerified = User::where('is_verified', 0)->count();
        $fullyVerified = User::where('is_verified', 1)->count();

        $totalSystems = LinkSystem::count();
        $activeSystems = LinkSystem::where('is_active', true)->count();

        $verificationPercentage = $totalResidents > 0
            ? round(($fullyVerified / $totalResidents) * 100, 1)
            : 0;

        $recentRequests = UserVerification::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($verification) {
                $user = $verification->user;

                return [
                    'id' => $verification->id,
                    'name' => $this->getFullName($user, $verification),
                    'id_type' => $verification->id_type ?? 'Unknown ID',
                    'status' => $this->getVerificationStatus(
                        $user?->is_verified,
                        $verification->status
                    ),
                    'created_at' => $verification->created_at?->toISOString(),
                ];
            });

        $recentActivity = UserVerification::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($verification) {
                $user = $verification->user;

                $name = collect([
                    $user?->first_name ?? $verification->first_name,
                    $user?->last_name ?? $verification->last_name,
                ])
                    ->filter()
                    ->join(' ');

                $status = $this->getVerificationStatus(
                    $user?->is_verified,
                    $verification->status
                );

                $title = match ($status) {
                    'fully_verified' => 'Resident fully verified',
                    'semi_verified' => 'Resident semi verified',
                    default => 'New verification request',
                };

                $description = match ($status) {
                    'fully_verified' => "{$name} completed full verification.",
                    'semi_verified' => "{$name} completed semi verification.",
                    default => "{$name} submitted a verification request.",
                };

                return [
                    'id' => $verification->id,
                    'status' => $status,
                    'title' => $title,
                    'description' => $description,
                    'created_at' => (
                        $verification->updated_at
                    ?? $verification->created_at
                    )?->toISOString(),
                ];
            });

        $systems = LinkSystem::latest()
            ->take(5)
            ->get()
            ->map(fn($system) => [
                'id' => $system->id,
                'name' => $system->label,
                'href' => $system->href,
                'active' => (bool) $system->is_active,
                'is_open' => (bool) $system->is_open,
            ]);

        return Inertia::render('app/admin/dashboard', [
            'dashboard' => [
                'statistics' => [
                    'total_residents' => $totalResidents,
                    'not_verified' => $notVerified,
                    'semi_verified' => $semiVerified,
                    'fully_verified' => $fullyVerified,
                    'total_systems' => $totalSystems,
                    'active_systems' => $activeSystems,
                ],
                'verification' => [
                    'percentage' => $verificationPercentage,
                    'total' => $totalResidents,
                    'not_verified' => $notVerified,
                    'semi_verified' => $semiVerified,
                    'fully_verified' => $fullyVerified,
                ],
                'recent_requests' => $recentRequests,
                'recent_activity' => $recentActivity,
                'systems' => $systems,
            ],
        ]);
    }
}
