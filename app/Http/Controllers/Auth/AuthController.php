<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Models\User;
use App\Services\Simulation\SimulationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function index()
    {
        return inertia('Auth/Login');
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        // Cek login
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Enable simulation mode for siswa with unlocked menus
            if ($user->role === 'siswa' && $user->is_menu_unlocked) {
                SimulationService::enableSimulation();
            }

            // Redirect berdasarkan role
            if (in_array($user->role, ['admin', 'front-office', 'housekeeping'])) {
                // Staff -> Dashboard
                return redirect('/Dashboard');
            } else {
                // Siswa -> Siswa Dashboard
                return redirect('/siswa/dashboard');
            }
        }

        return redirect()->back()->with(
            [
                'message' => 'Email atau password salah',
                'type' => 'error'
            ]
        )->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout(); // logout user

        $request->session()->invalidate(); // hapus session
        $request->session()->regenerateToken(); // generate CSRF baru

        return redirect('/Login'); // redirect ke login page
    }


    public function profile()
    {
        $user = Auth::user();
        return inertia('Auth/Profile', compact('user'));
    }

    public function editProfile(User $user)
    {
        return inertia('Auth/EditProfile', compact('user'));
    }

    public function updateProfile(UpdateProfileRequest $request, User $user)
    {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // hapus dari array supaya tidak menimpa password lama
        }

        $user->update($data);

        return back()->with(["message" => "Profile Berhasil diupdated", "type" => "success"]);
    }
}
