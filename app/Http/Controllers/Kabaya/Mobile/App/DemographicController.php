<?php

namespace App\Http\Controllers\Kabaya\Mobile\App;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DemographicController extends Controller
{
    /**
     * Get demographic statistics for Opol Municipality residents.
     *
     * This endpoint only returns aggregated statistics.
     * No individual resident information is returned.
     */
    public function index(): JsonResponse
    {
        /*
        |--------------------------------------------------------------------------
        | Get only residents from Opol Municipality
        |--------------------------------------------------------------------------
        */

        $residents = User::query()
            ->where('municipality', 'Opol')
            ->select([
                'birth_date',
                'sex',
                'marital_status',
            ])
            ->get();

        $totalResidents = $residents->count();

        /*
        |--------------------------------------------------------------------------
        | SEX
        |--------------------------------------------------------------------------
        */

        $maleCount = 0;
        $femaleCount = 0;
        $otherSexCount = 0;

        foreach ($residents as $resident) {
            $sex = strtolower(trim((string) $resident->sex));

            if (in_array($sex, ['male', 'm'])) {
                $maleCount++;
            } elseif (in_array($sex, ['female', 'f'])) {
                $femaleCount++;
            } else {
                $otherSexCount++;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | AGE
        |--------------------------------------------------------------------------
        */

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
                $birthDate = Carbon::parse($resident->birth_date);

                $age = $birthDate->age;

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
            } catch (\Throwable $e) {
                // Ignore invalid birth dates
                continue;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | MARITAL STATUS
        |--------------------------------------------------------------------------
        */

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

            if (array_key_exists($status, $maritalStatuses)) {
                $maritalStatuses[$status]++;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Percentage helper
        |--------------------------------------------------------------------------
        */

        $percentage = function (int $count) use ($totalResidents): int {
            if ($totalResidents === 0) {
                return 0;
            }

            return (int) round(
                ($count / $totalResidents) * 100
            );
        };

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'municipality' => 'Opol',

            'total_residents' => $totalResidents,

            /*
            |--------------------------------------------------------------------------
            | SEX
            |--------------------------------------------------------------------------
            */

            'sex' => [
                'male' => [
                    'count' => $maleCount,
                    'percentage' => $percentage($maleCount),
                ],

                'female' => [
                    'count' => $femaleCount,
                    'percentage' => $percentage($femaleCount),
                ],

                'other' => [
                    'count' => $otherSexCount,
                    'percentage' => $percentage($otherSexCount),
                ],
            ],

            /*
            |--------------------------------------------------------------------------
            | AGE
            |--------------------------------------------------------------------------
            */

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

            /*
            |--------------------------------------------------------------------------
            | MARITAL STATUS
            |--------------------------------------------------------------------------
            */

            'marital_status' => [
                'single' => [
                    'count' => $maritalStatuses['Single'],
                    'percentage' => $percentage(
                        $maritalStatuses['Single']
                    ),
                ],

                'married' => [
                    'count' => $maritalStatuses['Married'],
                    'percentage' => $percentage(
                        $maritalStatuses['Married']
                    ),
                ],

                'widowed' => [
                    'count' => $maritalStatuses['Widowed'],
                    'percentage' => $percentage(
                        $maritalStatuses['Widowed']
                    ),
                ],

                'separated' => [
                    'count' => $maritalStatuses['Separated'],
                    'percentage' => $percentage(
                        $maritalStatuses['Separated']
                    ),
                ],

                'annulled' => [
                    'count' => $maritalStatuses['Annulled'],
                    'percentage' => $percentage(
                        $maritalStatuses['Annulled']
                    ),
                ],

                'divorced' => [
                    'count' => $maritalStatuses['Divorced'],
                    'percentage' => $percentage(
                        $maritalStatuses['Divorced']
                    ),
                ],

                'live_in' => [
                    'count' => $maritalStatuses['Live-in'],
                    'percentage' => $percentage(
                        $maritalStatuses['Live-in']
                    ),
                ],
            ],
        ]);
    }
}