<?php

use App\Modules\User\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Modules\User\Controllers\UserController;
use Inertia\Inertia;
// Route::post('/register', [UserController::class, 'register'])->name('user.register');
// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::put('/profile', [UserController::class, 'updateProfile'])->name('user.updateProfile');
// });

// require __DIR__.'/auth.php';
// Route::get('/user-view', function () {
//     return view('user');
// });



// Route::get('/', function () {
//     return Inertia::render('LandingPage'); // Ensure you have a LandingPage component
// })->name('user.landing');
Route::prefix('user')->name('user.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('LandingPage');
    })->name('landing');
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');
    
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

require __DIR__.'/auth.php';

// Route::get('/user/login', function () {
//     return Inertia::render('Login');
// });
