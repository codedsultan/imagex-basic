<?php

namespace App\Modules\Mockup\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Mockup\Models\MockupTemplate;
use App\Modules\Mockup\Models\MockupTemplateVersion;

class MockupTemplateVersionApiController extends Controller
{
    public function index(MockupTemplate $template)
    {
        return response()->json($template->versions);
    }

    public function store(Request $request, MockupTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'view_angle' => 'required|in:front,back,left,right,3d',
            'color_code' => 'required|string',
            'model_type' => 'required|in:male,female,unisex,child,flat',
            'template_path' => 'required|string',
            'design_area' => 'required|json',
            'layers' => 'nullable|json',
            'configuration' => 'nullable|json',
        ]);

        $version = $template->versions()->create($validated);
        return response()->json($version, 201);
    }

    public function show(MockupTemplate $template, MockupTemplateVersion $version)
    {
        return response()->json($version);
    }

    public function update(Request $request, MockupTemplate $template, MockupTemplateVersion $version)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'view_angle' => 'sometimes|in:front,back,left,right,3d',
            'color_code' => 'sometimes|string',
            'model_type' => 'sometimes|in:male,female,unisex,child,flat',
            'template_path' => 'sometimes|string',
            'design_area' => 'sometimes|json',
            'layers' => 'sometimes|json',
            'configuration' => 'sometimes|json',
        ]);

        $version->update($validated);
        return response()->json($version);
    }

    public function destroy(MockupTemplate $template, MockupTemplateVersion $version)
    {
        $version->delete();
        return response()->json(['message' => 'Version deleted']);
    }

    public function restoreVersion(MockupTemplate $template, MockupTemplateVersion $version)
    {
        $template->update([
            'view_angle' => $version->view_angle,
            'color_code' => $version->color_code,
            'model_type' => $version->model_type,
            'template_path' => $version->template_path,
            'design_area' => $version->design_area,
            'layers' => $version->layers,
            'configuration' => $version->configuration,
        ]);

        return response()->json(['message' => 'Template restored to this version', 'template' => $template]);
    }
}