<?php

namespace App\Modules\Mockup\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Mockup\Models\MockupTemplate;

class MockupTemplateApiController extends Controller
{
    public function index()
    {
        return response()->json(MockupTemplate::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:mockup_templates,slug',
            'category_id' => 'required|exists:categories,id',
            'view_angle' => 'required|in:front,back,left,right,3d',
            'color_code' => 'required|string',
            'model_type' => 'required|in:male,female,unisex,child,flat',
            'template_path' => 'required|string',
            'design_area' => 'required|json',
            'is_active' => 'boolean',
        ]);

        $template = MockupTemplate::create($validated);
        return response()->json($template, 201);
    }

    public function show(MockupTemplate $template)
    {
        return response()->json($template);
    }

    public function update(Request $request, MockupTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:mockup_templates,slug,' . $template->id,
            'category_id' => 'sometimes|exists:categories,id',
            'view_angle' => 'sometimes|in:front,back,left,right,3d',
            'color_code' => 'sometimes|string',
            'model_type' => 'sometimes|in:male,female,unisex,child,flat',
            'template_path' => 'sometimes|string',
            'design_area' => 'sometimes|json',
            'is_active' => 'boolean',
        ]);

        $template->update($validated);
        return response()->json($template);
    }

    public function destroy(MockupTemplate $template)
    {
        $template->delete();
        return response()->json(['message' => 'Template deleted']);
    }

}