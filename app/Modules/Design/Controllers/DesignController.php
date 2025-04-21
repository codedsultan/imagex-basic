<?php

namespace App\Modules\Design\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Modules\Design\Interfaces\Services\DesignServiceInterface;
use App\Modules\Design\Models\Design;
use Illuminate\Support\Facades\Auth;

class DesignController extends Controller
{
    public function __construct(
        private DesignServiceInterface $designService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Designs/Index', [
            'designs' => $this->designService->getUserDesigns($request->user()->id)
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $nextNumber = $user->last_untitled_design_index + 1;
        $suggestedName = "Untitled Design {$nextNumber}";
        return Inertia::render('Designs/Create', [
            'suggestedName' => $suggestedName
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:png,jpg,svg|max:2048'
        ]);


        // If the user didn't type a custom name and it matches the suggested format, use & bump the counter
        if (preg_match('/^Untitled Design (\d+)$/', $validated['title'], $matches)) {
            $expectedNext = $request->user()->last_untitled_design_index + 1;

            if ((int)$matches[1] === $expectedNext) {
                // Only increment if it was the expected next
                $request->user()->increment('last_untitled_design_index');
            }
        }
        $this->designService->createDesign(
            [
                'title' => $validated['title'] ?: $request->user()->last_untitled_design_index + 1,
                'description' => $validated['description'],
                'user_id' => $request->user()->id
            ],
            $request->file('file')
        );

        return redirect()->route('designs');
    }


    public function show(Design $design)
    {

        $designs = Design::where('user_id', Auth::user()->id)->get();

        return Inertia::render('Designs/Show', [
            'design' => $design,
            'designs' => $designs
        ]);
    }
}