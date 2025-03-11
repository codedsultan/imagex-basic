<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Controllers\UserController;

Route::post('/register', [UserController::class, 'register'])->name('user.register');
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/profile', [UserController::class, 'updateProfile'])->name('user.updateProfile');
});
