<?php

use App\Modules\Mockup\Controllers\MockupApiController;
use App\Modules\Mockup\Controllers\MockupController;
use Illuminate\Support\Facades\Route;
use App\Modules\Mockup\Controllers\MockupTemplateApiController;
use App\Modules\Mockup\Controllers\MockupTemplateVersionApiController;
Route::middleware('auth:sanctum')->group(function () {
// Mockup Templates
    Route::prefix('mockup-templates')->group(function () {
        Route::get('/', [MockupTemplateApiController::class, 'index']);
        Route::post('/', [MockupTemplateApiController::class, 'store']);
        Route::get('{template}', [MockupTemplateApiController::class, 'show']);
        Route::put('{template}', [MockupTemplateApiController::class, 'update']);
        Route::delete('{template}', [MockupTemplateApiController::class, 'destroy']);

        // Mockup Template Versions
        Route::prefix('{template}/versions')->group(function () {
            Route::get('/', [MockupTemplateVersionApiController::class, 'index']);
            Route::post('/', [MockupTemplateVersionApiController::class, 'store']);
            Route::get('{version}', [MockupTemplateVersionApiController::class, 'show']);
            Route::put('{version}', [MockupTemplateVersionApiController::class, 'update']);
            Route::delete('{version}', [MockupTemplateVersionApiController::class, 'destroy']);
            Route::post('{version}/restore', [MockupTemplateVersionApiController::class, 'restoreVersion']);
        });
    });


    // Route::post('/mockups/generate', [MockupApiController::class, 'generate']);
    Route::post('/mockups/{mockup}/update', [MockupApiController::class, 'update']);
    Route::get('/mockups', [MockupApiController::class, 'index']);
    Route::post('/mockups', [MockupApiController::class, 'store']);
    Route::post('/mockups/{mockup}/generate', [MockupController::class, 'generate']);
    Route::post('/mockups/{mockup}/save-version', [MockupController::class, 'saveVersion']);
    Route::get('/mockups/{mockup}/versions', [MockupController::class, 'getVersions']);
    Route::post('/mockups/{mockup}/restore/{version}', [MockupController::class, 'restoreVersion']);

});

