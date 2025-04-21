<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EditorTemplate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EditorTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = EditorTemplate::query();

        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Search by name if provided
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $perPage = $request->input('per_page', 15);

        return $query->paginate($perPage);
    }

    // GET /api/editor-templates/{id}
    public function show($id)
    {
        // dd($id);
        $template = EditorTemplate::with('media')->findOrFail($id);
        return response()->json($template);
    }

    // POST /api/editor-templates
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:mockup,design,packaging',
            'layers' => 'sometimes|json',
            'configuration' => 'required|json',
            'width' => 'sometimes|integer|min:1',
            'height' => 'sometimes|integer|min:1',
            'thumbnail'     => 'nullable|image|max:2048', // file upload for thumbnail
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $validator->validated();
        // $template = EditorTemplate::create($data);
        $template = new EditorTemplate();
        $template->id = Str::uuid()->toString();
        $template->name = $request->name;
        $template->type = $request->type;

        if ($request->has('layers')) {
            $template->layers = $request->layers;
        }

        $template->configuration = $request->configuration;

        if ($request->has('width')) {
            $template->width = $request->width;
        }

        if ($request->has('height')) {
            $template->height = $request->height;
        }


        // If a thumbnail file is uploaded, attach it.
        if ($request->hasFile('thumbnail')) {
            $template->addMediaFromRequest('thumbnail')
                     ->preservingOriginal()
                     ->toMediaCollection('thumbnails');
        }

        return response()->json($template, 201);
    }

    // PUT/PATCH /api/editor-templates/{id}
    public function update(Request $request, $id)
    {
        $template = EditorTemplate::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:mockup,design,packaging',
            'layers' => 'sometimes|json',
            'configuration' => 'required|json',
            'width' => 'sometimes|integer|min:1',
            'height' => 'sometimes|integer|min:1',
            'thumbnail'     => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $template->update($validator->validated());

        if ($request->hasFile('thumbnail')) {
            // Optionally remove the previous thumbnail.
            $template->clearMediaCollection('thumbnails');
            $template->addMediaFromRequest('thumbnail')
                     ->preservingOriginal()
                     ->toMediaCollection('thumbnails');
        }

        return response()->json($template);
    }

    // DELETE /api/editor-templates/{id}
    public function destroy($id)
    {
        $template = EditorTemplate::findOrFail($id);
        $template->delete();
        return response()->json(null, 204);
    }

    /**
     * Clone an existing template.
     *
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function clone($id)
    {
        $template = EditorTemplate::findOrFail($id);

        $newTemplate = $template->replicate();
        $newTemplate->id = Str::uuid()->toString();
        $newTemplate->name = $template->name . ' (Copy)';
        $newTemplate->save();

        return response()->json($newTemplate, 201);
    }
}
