<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Controllers\UserController;

Route::post('/register', [UserController::class, 'register'])->name('user.register');
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/profile', [UserController::class, 'updateProfile'])->name('user.updateProfile');
});


Route::get('/user-view', function () {
    return view('user');
});


use Inertia\Inertia;

Route::get('/user/login', function () {
    return Inertia::render('Login');
});
