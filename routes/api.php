<?php

use App\Http\Controllers\EditorTemplateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Editor Template Routes
// Route::prefix('editor-templates')->middleware('auth')->group(function () {
//     Route::get('/', [EditorTemplateController::class, 'index']);
//     Route::post('/', [EditorTemplateController::class, 'store']);
//     // Route::get('/{id}/edit', [EditorTemplateController::class, 'show']);
//     Route::get('/{id}', [EditorTemplateController::class, 'show']);
//     Route::put('/{id}', [EditorTemplateController::class, 'update']);
//     Route::delete('/{id}', [EditorTemplateController::class, 'destroy']);
//     Route::get('/type/{type}', [EditorTemplateController::class, 'getByType']);
//     Route::post('/{id}/clone', [EditorTemplateController::class, 'clone']);
// });