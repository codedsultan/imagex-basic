<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        // return redirect()->intended(session('login_redirect', '/'));
        // dd('hre');
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Display the login view.
     */
    public function login()
    {
        // dd('hre');
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // dd('here');
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }


    // protected function redirectTo()
    // {
    //     $host = request()->getHost();

    //     // Customize these as needed for your domains.
    //     if ($host === 'admin.imagex-basic.test' || $host === 'admin.imagex-basic') {
    //         return route('admin.login');
    //     } else if ($host === 'users.imagex-basic.test' || $host === 'users.imagex-basic') {
    //         return route('user.login');
    //     }
    //     else {
    //         return route('auth.login');
    //     }

    //     // Fallback redirect
    //     return '/';
    // }

}
