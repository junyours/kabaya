<?php

namespace App\Http\Controllers\Kabaya\Mobile\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SignUpController extends Controller
{
    public function getResident(Request $request)
    {
        $search = $request->input('search');

        $residents = User::select(
            'id',
            'first_name',
            'suffix',
            'middle_name',
            'last_name',
            'email'
        )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('suffix', 'like', "%{$search}%")
                        ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"])
                        ->orWhereRaw("CONCAT(first_name, ' ', middle_name, ' ', last_name) LIKE ?", ["%{$search}%"])
                        ->orWhereRaw("CONCAT(first_name, ' ', middle_name, ' ', last_name, ' ', suffix) LIKE ?", ["%{$search}%"]);
                });
            })
            ->where('role', 'user')
            ->paginate(20);

        return response()->json($residents);
    }

    public function signUp(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string'],
            'suffix' => ['nullable', 'string'],
            'middle_name' => ['nullable', 'string'],
            'last_name' => ['required', 'string'],
            'birth_date' => ['required', 'date'],
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $data['email'])->first();

        $emailTaken = User::where('email', $data['email'])
            ->whereNotNull('email_verified_at')
            ->exists();

        if ($emailTaken) {
            throw ValidationException::withMessages([
                'email' => 'The email has already been taken.'
            ]);
        }

        $user = User::where('first_name', $data['first_name'])
            ->where('last_name', $data['last_name'])
            ->where('birth_date', $data['birth_date'])
            ->first();

        if ($user) {
            if ($user->is_verified !== null) {
                throw ValidationException::withMessages([
                    'email' => 'An account with these details already registered.'
                ]);
            }

            $updateData = array_filter($data, fn($value) => !is_null($value) && $value !== '');

            $updateData['is_resident'] = true;
            $user->update($updateData);
        } else {
            $user = User::create($data);
        }

        $this->otp($user->id);
    }

    public function verifyOtp(Request $request)
    {
        $data = $request->validate([
            'email' => ['required'],
            'otp' => ['required'],
        ]);

        $this->verify($data);

        $user = User::where('email', $data['email'])->first();

        if ($user->is_resident) {
            $updateData['is_verified'] = false;
        }

        $updateData['email_verified_at'] = now();

        $user->update($updateData);
    }

    public function createPin(Request $request)
    {
        $user = User::where('email', $request->email)
            ->whereNotNull('email_verified_at')
            ->first();

        $data = $request->validate([
            'password' => ['required', 'confirmed'],
        ]);

        do {
            $year = now()->year;
            $month = now()->month;
            $random = random_int(1000, 9999);

            $id_number = "{$year}-{$month}-{$random}";
        } while (
            User::query()
                ->where('id_number', $id_number)
                ->exists()
        );

        $user->update([
            'id_number' => $id_number,
            'password' => Hash::make($data['password']),
        ]);

        UserSession::create([
            'user_id' => $user->id,
            'device_id' => $request->device_id,
        ]);

        return response()->json([
            'token' => $user->createToken($request->token_name, ['*'], now()->addWeek())->plainTextToken
        ]);
    }
}
