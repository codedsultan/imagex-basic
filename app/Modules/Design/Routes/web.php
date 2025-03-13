<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Design\Http\Controllers\DesignController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('designs', DesignController::class)
        ->except(['show'])
        ->names('designs');
});