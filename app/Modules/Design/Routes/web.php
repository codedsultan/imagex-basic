<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Design\Controllers\DesignController;

Route::middleware(['web', 'auth'])->group(function () {
    // Route::resource('designs', DesignController::class)
    //     ->except(['show'])
    //     ->names('designs');

    Route::get('/designs', [DesignController::class, 'index'])->name('designs');
    Route::get('/designs/create', [DesignController::class, 'create'])->name('designs.create');
    Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');
    Route::get('/designs/{design}', [DesignController::class, 'show'])->name('designs.show');
    Route::get('/designs/{design}/edit', [DesignController::class, 'edit'])->name('designs.edit');
    Route::put('/designs/{design}', [DesignController::class, 'update'])->name('designs.update');
    Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
});