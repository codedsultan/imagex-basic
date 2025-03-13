<?php

namespace App\Modules\Design\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Design\Interfaces\Services\DesignServiceInterface;


class DesignController extends Controller
{
    public function __construct(
        private DesignServiceInterface $designService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Design/Index', [
            'designs' => $this->designService->getUserDesigns($request->user()->id)
        ]);
    }

    public function create()
    {
        return Inertia::render('Design/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:png,jpg,svg|max:2048'
        ]);

        $this->designService->createDesign(
            [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'user_id' => $request->user()->id
            ],
            $request->file('file')
        );

        return redirect()->route('designs.index');
    }

    // Add show, edit, update, destroy methods
}