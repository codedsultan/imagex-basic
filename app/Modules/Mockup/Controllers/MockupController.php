<?php

namespace App\Modules\Mockup\Controllers;

use Illuminate\Http\Request;
use App\Modules\Mockup\Models\Mockup;
use App\Modules\Mockup\Services\MockupService;
use App\Http\Controllers\Controller;
use App\Models\EditorTemplate;
use App\Modules\Mockup\Models\MockupTemplate;
use App\Modules\Mockup\Models\MockupVersion;
use App\Services\MediaService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MockupController extends Controller
{
    public function __construct(
        protected MockupService $mockupService,
        protected MediaService $mediaService
    ) {}

    public function index()
    {
        $mockups =  Mockup::where('user_id', Auth::user()->id)
                        ->orderBy('updated_at', 'desc')
                        ->paginate(10);

        $templates = EditorTemplate::whereType('mockup')->get();

        return Inertia::render('Mockups/Index', [
            'mockups' => $mockups,
            'templates' => $templates
        ]);

    }

    public function editor(Request $request)
    {
        $mockup_id = $request->get('mockup');
        $template_id = $request->get('template');

        $mockup = Mockup::find($mockup_id);
        if ($mockup) {
            $template_id = $mockup->template_id;
        }

        if (!$template_id) {
            abort(404, 'Template ID is required.');
        }

        // Suggest a default name
        $user = $request->user();
        $nextNumber = $user->last_untitled_mockup_index + 1;
        $suggestedName = "Untitled Mockup {$nextNumber}";

        return Inertia::render('Mockups/Editor', [
            'mockup_id' => $mockup_id,
            'template_id' => $template_id,
            'suggestedName' => $suggestedName,
        ]);
    }


    public function create()
    {
        $templates = MockupTemplate::with('media')->get();

        return Inertia::render('Mockups/Create',[
            'templates' => $templates
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'design_id' => 'required|exists:designs,id',
            'product_id' => 'required|exists:products,id',
            'template_id' => 'required|exists:mockup_templates,id',
            'name' => 'required|string|max:255',
            'json_data' => 'required|string',
            'metadata' => 'sometimes|array',
            'front_image' => 'nullable|string', // Base64 from Fabric.js
            'print_areas' => 'required|array',  // Contains position data

        ]);

        $mockup = $this->mockupService->storeMockup($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Mockup updated!',
            'mockup' => $mockup
        ],201);
    }


    public function update(Request $request, Mockup $mockup)
    {
        $validated = $request->validate([
            'design_id'    => 'required|exists:designs,id',
            'product_id'   => 'required|exists:products,id',
            'name'         => 'required|string|max:255',
            'json_data'    => 'required|string',
            'front_image'  => 'nullable|string',
            'print_areas'  => 'required|array',
        ]);

        $updated = $this->mockupService->updateMockup($mockup, $validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Mockup updated!',
            'mockup'  => $updated,
        ]);

    }


    public function saveVersion(Mockup $mockup)
    {
        if ($mockup->status !== 'approved') {
            return response()->json(['error' => 'Only approved mockups can have versions'], 403);
        }

        $mockup->createNewVersion();

        return response()->json(['message' => 'New mockup version saved']);
    }

    public function getVersions(Mockup $mockup)
    {
        return response()->json($mockup->versions()->latest()->get());
    }

    public function restoreVersion(Mockup $mockup, MockupVersion $version)
    {
        $mockup->restoreFromVersion($version);
        return response()->json(['message' => 'Mockup restored!']);
    }

    public function show(Request $request, Mockup $mockup)
    {
        return response()->json($mockup);
    }

    public function destroy(Mockup $mockup)
    {
        // $this->authorize('delete', $mockup);

        $this->mockupService->deleteMockup($mockup);

        return response()->json([
            'status'  => 'success',
            'message' => 'Mockup deleted successfully',
        ], 200);
    }

}
