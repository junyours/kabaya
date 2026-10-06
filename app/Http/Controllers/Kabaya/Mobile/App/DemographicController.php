<?php

namespace App\Http\Controllers\Kabaya\Mobile\App;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DemographicController extends Controller
{
    public function index(): JsonResponse
    {
        $residents = User::query()
            ->where('municipality', 'Opol')
            ->select([
                'birth_date',
                'sex',
                'marital_status',
            ])
            ->get();

        $totalResidents = $residents->count();

        $sexCounts = [
            'male' => 0,
            'female' => 0,
            'other' => 0,
        ];

        foreach ($residents as $resident) {
            $sex = strtolower(trim((string) $resident->sex));

            if (in_array($sex, ['male', 'm'])) {
                $sexCounts['male']++;
            } elseif (in_array($sex, ['female', 'f'])) {
                $sexCounts['female']++;
            } else {
                $sexCounts['other']++;
            }
        }

        $ageGroups = [
            '0-17' => 0,
            '18-30' => 0,
            '31-45' => 0,
            '46-60' => 0,
            '61+' => 0,
        ];

        foreach ($residents as $resident) {
            if (empty($resident->birth_date)) {
                continue;
            }

            try {
                $age = Carbon::parse($resident->birth_date)->age;

                if ($age <= 17) {
                    $ageGroups['0-17']++;
                } elseif ($age <= 30) {
                    $ageGroups['18-30']++;
                } elseif ($age <= 45) {
                    $ageGroups['31-45']++;
                } elseif ($age <= 60) {
                    $ageGroups['46-60']++;
                } else {
                    $ageGroups['61+']++;
                }
            } catch (\Throwable) {
                continue;
            }
        }

        $maritalStatuses = [
            'Single' => 0,
            'Married' => 0,
            'Widowed' => 0,
            'Separated' => 0,
            'Annulled' => 0,
            'Divorced' => 0,
            'Live-in' => 0,
        ];

        foreach ($residents as $resident) {
            $status = trim((string) $resident->marital_status);

            if (isset($maritalStatuses[$status])) {
                $maritalStatuses[$status]++;
            }
        }

        $percentage = fn(int $count): int => $totalResidents > 0
            ? (int) round(($count / $totalResidents) * 100)
            : 0;

        return response()->json([
            'municipality' => 'Opol',
            'total_residents' => $totalResidents,

            'sex' => [
                'male' => [
                    'count' => $sexCounts['male'],
                    'percentage' => $percentage($sexCounts['male']),
                ],
                'female' => [
                    'count' => $sexCounts['female'],
                    'percentage' => $percentage($sexCounts['female']),
                ],
                'other' => [
                    'count' => $sexCounts['other'],
                    'percentage' => $percentage($sexCounts['other']),
                ],
            ],

            'age' => [
                '0-17' => [
                    'count' => $ageGroups['0-17'],
                    'percentage' => $percentage($ageGroups['0-17']),
                ],
                '18-30' => [
                    'count' => $ageGroups['18-30'],
                    'percentage' => $percentage($ageGroups['18-30']),
                ],
                '31-45' => [
                    'count' => $ageGroups['31-45'],
                    'percentage' => $percentage($ageGroups['31-45']),
                ],
                '46-60' => [
                    'count' => $ageGroups['46-60'],
                    'percentage' => $percentage($ageGroups['46-60']),
                ],
                '61+' => [
                    'count' => $ageGroups['61+'],
                    'percentage' => $percentage($ageGroups['61+']),
                ],
            ],

            'marital_status' => [
                'single' => [
                    'count' => $maritalStatuses['Single'],
                    'percentage' => $percentage($maritalStatuses['Single']),
                ],
                'married' => [
                    'count' => $maritalStatuses['Married'],
                    'percentage' => $percentage($maritalStatuses['Married']),
                ],
                'widowed' => [
                    'count' => $maritalStatuses['Widowed'],
                    'percentage' => $percentage($maritalStatuses['Widowed']),
                ],
                'separated' => [
                    'count' => $maritalStatuses['Separated'],
                    'percentage' => $percentage($maritalStatuses['Separated']),
                ],
                'annulled' => [
                    'count' => $maritalStatuses['Annulled'],
                    'percentage' => $percentage($maritalStatuses['Annulled']),
                ],
                'divorced' => [
                    'count' => $maritalStatuses['Divorced'],
                    'percentage' => $percentage($maritalStatuses['Divorced']),
                ],
                'live_in' => [
                    'count' => $maritalStatuses['Live-in'],
                    'percentage' => $percentage($maritalStatuses['Live-in']),
                ],
            ],
        ]);
    }
}