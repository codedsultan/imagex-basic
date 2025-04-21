<?php

namespace App\Modules\Mockup\Controllers;

use Illuminate\Http\Request;
use App\Modules\Mockup\Models\Mockup;
use App\Modules\Mockup\Services\MockupService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MockupApiController extends Controller
{
    public function __construct(
        protected MockupService $mockupService
    ) {}

    public function index()
    {
        return response()->json(
            Mockup::with(['design', 'product'])
                ->where('user_id', Auth::user()->id)
                ->paginate(10)
        );
    }

}
