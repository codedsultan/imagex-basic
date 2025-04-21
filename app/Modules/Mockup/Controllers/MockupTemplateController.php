<?php

namespace App\Modules\Mockup\Controllers;

use Illuminate\Http\Request;
use App\Modules\Mockup\Models\Mockup;
use App\Modules\Mockup\Services\MockupService;
use App\Http\Controllers\Controller;
use App\Models\EditorTemplate;
use App\Modules\Mockup\Models\MockupTemplate;
use App\Modules\Mockup\Models\MockupTemplateVersion;

use Inertia\Inertia;

class MockupTemplateController extends Controller
{
    public function index()
    {
        // $templates = MockupTemplate::latest()->paginate(10);
        $templates = EditorTemplate::latest()->paginate(10);
        // dd($templates);
        return Inertia::render('MockupTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('MockupTemplates/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            // 'slug' => 'required|unique:mockup_templates,slug',
            // 'description' => 'nullable|string',
            // 'view_angle' => 'required|in:front,back,left,right,3d',
            // 'color_code' => 'required|string',
            // 'model_type' => 'required|in:male,female,unisex,child,flat',
            // 'template_path' => 'required|string',
            // 'design_area' => 'required|json',
        ]);

        $template = MockupTemplate::create($data);
        return redirect()->route('mockup-templates.editor', ['id' => $template->id]);
        // return redirect()->route('mockup-templates')->with('success', 'Template created successfully.');
    }

    public function show(Request $request,MockupTemplate $template)
    {
        if ($request->inertia()) {
            return Inertia::render('MockupTemplates/Show', [
                // 'template' => $template,
                'templateId' => $template->id,
                'templateType' => $template->type,
            ]);
        }

        return response()->json($template);

    }

    public function edit(EditorTemplate $template)
    {
        // dd($template);
        // return Inertia::render('MockupTemplates/MockupEditor', [
        return Inertia::render('MockupTemplates/Editor', [
            'templateId' => $template->id,
            'templateType' => $template->type,
            'template' => [
                // 'templateId' => $template->id,
                // 'templateType' => $template->type,
                'id' => $template->id,
                'name' => $template->name,
                'layers' => $template->layers,
                'configuration' => $template->configuration,
                // Add any other required fields
            ]
        ]);
        return Inertia::render('MockupTemplates/Editor', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, MockupTemplate $template)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:mockup_templates,slug,' . $template->id,
            'description' => 'nullable|string',
            'view_angle' => 'required|in:front,back,left,right,3d',
            'color_code' => 'required|string',
            'model_type' => 'required|in:male,female,unisex,child,flat',
            'template_path' => 'required|string',
            'design_area' => 'required|json',
        ]);

        $template->update($data);

        return redirect()->route('mockup-templates')->with('success', 'Template updated successfully.');
    }

    public function destroy(MockupTemplate $template)
    {
        $template->delete();

        return redirect()->route('mockup-templates')->with('success', 'Template deleted.');
    }

}
