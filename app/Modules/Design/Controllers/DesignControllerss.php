<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Design;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use App\Services\DesignMediaServiceInterface;

class DesignController extends Controller
{

    protected DesignMediaServiceInterface $designMediaService;

    public function __construct(DesignMediaServiceInterface $designMediaService)
    {
        $this->designMediaService = $designMediaService;
    }
    public function index()
    {
        $designs = Auth::user()->designs()->latest()->get()->map(function ($design) {
            // Append a full preview URL using Laravel's asset helper.
            // $design->preview_url = asset('storage/designs/' . $design->image_path);
            // $design->preview_url = asset('storage/designs/thumbnails/thumb_' . $design->image_path);
            $design->preview_url = asset('storage/designs/watermarked/' . $design->image_path);

            return $design;
        });

        // dd($designs);
        return Inertia::render('Designs/Index', [
            'designs' => $designs
        ]);
    }

    public function create()
    {
        return Inertia::render('Designs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'design_data' => 'required|json',
            'design_image' => 'nullable|image|max:2048',
            // 'thumbnail'   => 'nullable|image|max:2048',
        ]);

        // // Handle thumbnail upload
        // if ($request->hasFile('thumbnail')) {
        //     $path = $request->file('thumbnail')->store('thumbnails', 'public');
        //     $validated['thumbnail'] = $path;
        // }
        $design = Auth::user()->designs()->create($validated);

        if ($request->hasFile('design_image')) {
            $file = $request->file('design_image');
            $this->designMediaService->addDesignImage($design, $file->getRealPath());
        }




        return redirect()->route('designs.edit', $design->id)
            ->with('success', 'Design created successfully.');
    }

    public function show(Design $design)
    {
        // $design = Design::findOrFail($id);
        // Optionally, you can ensure the preview_url is also computed
        $design->preview_url = asset('storage/designs/thumbnails/thumb_' . $design->image_path);

        return Inertia::render('Designs/Show', [
            'auth'   => Auth::user(),
            'design' => $design,
        ]);
    }
    public function edit(Design $design)
    {
        $this->authorize('update', $design);

        return Inertia::render('Designs/Edit', [
            'design' => $design
        ]);
    }

    public function update(Request $request, Design $design)
    {
        $this->authorize('update', $design);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'design_data' => 'required|json',
            'thumbnail'   => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($design->thumbnail) {
                Storage::disk('public')->delete($design->thumbnail);
            }
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        $design->update($validated);

        return back()->with('success', 'Design updated successfully.');
    }

    public function destroy(Design $design)
    {
        $this->authorize('delete', $design);

        if ($design->thumbnail) {
            Storage::disk('public')->delete($design->thumbnail);
        }

        $design->delete();

        return redirect()->route('designs.index')
            ->with('success', 'Design deleted successfully.');
    }
}
