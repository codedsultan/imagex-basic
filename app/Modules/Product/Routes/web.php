<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Product\Controllers\ProductController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('products', ProductController::class);
});