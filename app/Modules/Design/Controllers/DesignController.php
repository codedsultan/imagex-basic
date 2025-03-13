<?php

namespace App\Modules\Design\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Design\Interfaces\Services\DesignServiceInterface;
use App\Modules\Design\Models\Design;

class DesignController extends Controller
{
    public function __construct(
        private DesignServiceInterface $designService
    ) {}

    public function index(Request $request)
    {
        // $designs = $this->designService->getUserDesigns($request->user()->id)->map(function ($design) {
        //     return $design;
        // });
        return Inertia::render('Designs/Index', [
            'designs' => $this->designService->getUserDesigns($request->user()->id)
        ]);
    }

    public function create()
    {
        return Inertia::render('Designs/Create');
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


    public function show(Design $design)
    {
        // $design = Design::findOrFail($id);
        // Optionally, you can ensure the preview_url is also computed
        $design->preview_url = asset('storage/designs/thumbnails/thumb_' . $design->image_path);

        return Inertia::render('Designs/Show', [
            'design' => $design,
        ]);
    }
    // Add show, edit, update, destroy methods
}