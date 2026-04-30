<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLogin()
    {
        return inertia('auth/login', [
            'canResetPassword' => true,
            'canRegister' => false, // Disabled public registration
            'status' => session('status'),
        ]);
    }

    public function showRegister()
    {
        // Redirect to login - public registration is disabled
        return redirect()->route('login')->with('error', 'Public registration is disabled. Please contact your administrator.');
    }

    public function register(Request $request)
    {
        // Disable public registration
        return redirect()->route('login')->with('error', 'Public registration is disabled. Please contact your administrator.');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
