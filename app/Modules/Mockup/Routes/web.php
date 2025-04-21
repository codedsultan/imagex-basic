<?php

use App\Http\Controllers\EditorTemplateController;
use Illuminate\Support\Facades\Route;
use App\Modules\Design\Controllers\DesignController;
use App\Modules\Mockup\Controllers\MockupController;
use App\Modules\Mockup\Controllers\MockupTemplateController;

Route::middleware(['web', 'auth'])->group(function () {
    // Route::resource('mockups', MockupController::class);

    Route::get('/mockups/create', [MockupController::class, 'create'])->name('mockups.create');
    Route::get('/mockups/editor', [MockupController::class, 'editor'])->name('mockups.editor');
    Route::get('/mockups/{mockup}', [MockupController::class, 'show'])->name('mockups.show');
    Route::get('/mockups', [MockupController::class, 'index'])->name('mockups');

    Route::post('/mockups', [MockupController::class, 'store'])->name('mockups.save');
    Route::put('/mockups/{mockup}', [MockupController::class, 'update'])->name('mockups.update');

    Route::delete('/mockups/{mockup}', [MockupController::class, 'destroy'])
     ->name('mockups.destroy');





    Route::get('/mockup-templates', [MockupTemplateController::class, 'index'])->name('mockup-templates');
    Route::get('/mockup-templates/create', [MockupTemplateController::class, 'create'])->name('mockup-templates.create');
    Route::post('/mockup-templates', [MockupTemplateController::class, 'store'])->name('mockup-templates.store');
    Route::get('/mockup-templates/{template}', [MockupTemplateController::class, 'show'])->name('mockup-templates.show');
    Route::get('/mockup-templates/{template}/edit', [MockupTemplateController::class, 'edit'])->name('mockup-templates.editor');
    Route::put('/mockup-templates/{template}', [MockupTemplateController::class, 'update'])->name('mockup-templates.update');
    Route::delete('/mockup-templates/{template}', [MockupTemplateController::class, 'destroy'])->name('mockup-templates.destroy');
    // Route::get('/mockups/{template}/create', [MockupController::class, 'create'])->name('mockups.create');

    Route::prefix('api/editor-templates')->group(function () {
        Route::get('/', [EditorTemplateController::class, 'index']);
        Route::post('/', [EditorTemplateController::class, 'store']);
        // Route::get('/{id}/edit', [EditorTemplateController::class, 'show']);
        Route::get('/{id}', [EditorTemplateController::class, 'show']);
        Route::put('/{id}', [EditorTemplateController::class, 'update']);
        Route::delete('/{id}', [EditorTemplateController::class, 'destroy']);
        Route::get('/type/{type}', [EditorTemplateController::class, 'getByType']);
        Route::post('/{id}/clone', [EditorTemplateController::class, 'clone']);
    });
});
