<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Design\Http\Controllers\DesignApiController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/designs/generate-thumbnail', [DesignApiController::class, 'generateThumbnail']);
});