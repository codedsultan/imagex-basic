<?php

namespace App\Modules\Mockup\Controllers;

use Illuminate\Http\Request;
use App\Modules\Mockup\Models\Mockup;
use App\Modules\Mockup\Services\MockupService;
use App\Http\Controllers\Controller;
use App\Modules\Mockup\Models\MockupTemplate;
use App\Modules\Mockup\Models\MockupTemplateVersion;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MockupTemplateController extends Controller
{
    public function __construct(
        protected MockupService $mockupService
    ) {}

    public function index()
    {

       $mockups =  Mockup::with(['design', 'product'])
                    ->where('user_id', Auth::user()->id)
                    ->paginate(10);

        return Inertia::render('Mockups/Index', [
            'mockups' => $mockups
        ]);

    }

    public function restoreVersion($id, $versionId)
    {
        $version = MockupTemplateVersion::where('template_id', $id)->findOrFail($versionId);
        MockupTemplate::where('id', $id)->update($version->only([
            'name', 'slug', 'category_id', 'view_angle', 'color_code',
            'model_type', 'template_path', 'design_area', 'layers', 'configuration'
        ]));

        return response()->json(['message' => 'Version restored successfully!']);
    }

}